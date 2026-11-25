import { describe, expect, it } from "vitest";
import { addVariant, slotHasContent, updateLinkIcon, watchSlot } from "./utility.js";
import { mount, settle } from "../test/helpers.js";

describe("slotHasContent", () => {
	// A host whose open shadow root holds a named and a default slot, so tests can assign to either.
	const slotted = (html) => {
		const host = mount(`<div>${html}</div>`);
		host.attachShadow({ mode: "open" }).innerHTML = '<slot name="part"></slot><slot></slot>';
		return {
			named: host.shadowRoot.querySelector('slot[name="part"]'),
			unnamed: host.shadowRoot.querySelector("slot:not([name])"),
		};
	};

	it("is false with no assigned nodes", () => {
		expect(slotHasContent(slotted("").named)).toBe(false);
	});

	it("is false for whitespace-only text", () => {
		expect(slotHasContent(slotted("  \n\t ").unnamed)).toBe(false);
	});

	it("is true for real text", () => {
		expect(slotHasContent(slotted(" hello ").unnamed)).toBe(true);
	});

	it("is true for an element, even an empty one", () => {
		expect(slotHasContent(slotted('<span slot="part"></span>').named)).toBe(true);
	});

	// A component that wraps another and forwards its own slot into the inner one assigns a <slot>
	// element; only what that slot carries counts.
	const forwarded = (html) => {
		const outer = mount(`<div>${html}</div>`);
		const inner = document.createElement("div");
		inner.attachShadow({ mode: "open" }).innerHTML = '<slot name="part"></slot>';
		// inner's light DOM is outer's forwarding slot, assigned to inner's own "part" slot.
		inner.innerHTML = '<slot name="part" slot="part"></slot>';
		outer.attachShadow({ mode: "open" }).append(inner);
		return inner.shadowRoot.querySelector("slot");
	};

	it("is false for a forwarded slot with nothing in it", () => {
		expect(slotHasContent(forwarded(""))).toBe(false);
	});

	it("is true for a forwarded slot carrying content", () => {
		expect(slotHasContent(forwarded('<em slot="part">x</em>'))).toBe(true);
	});

	// Flattening an unassigned slot returns its fallback children, which are the component's own
	// default, not content the page provided.
	it("ignores a slot's own fallback content", () => {
		const host = mount("<div></div>");
		host.attachShadow({ mode: "open" }).innerHTML = "<slot>Copy</slot>";
		expect(slotHasContent(host.shadowRoot.querySelector("slot"))).toBe(false);
	});
});

describe("watchSlot", () => {
	it("reports the current state at once and again whenever the slot changes", async () => {
		const host = mount("<div></div>");
		host.attachShadow({ mode: "open" }).innerHTML = '<slot name="part"></slot>';
		const seen = [];
		watchSlot(host.shadowRoot.querySelector("slot"), (filled) => seen.push(filled));
		expect(seen).toEqual([false]);
		host.innerHTML = '<b slot="part">x</b>';
		await settle();
		expect(seen).toEqual([false, true]);
		host.innerHTML = "";
		await settle();
		expect(seen).toEqual([false, true, false]);
	});
});

describe("addVariant", () => {
	it("adds a BEM modifier per class name", () => {
		const element = document.createElement("a");
		addVariant("filled  radius-pill", element, "cta");
		expect([...element.classList]).toEqual(["cta--filled", "cta--radius-pill"]);
	});

	it("replaces previous modifiers but keeps other classes", () => {
		const element = document.createElement("a");
		element.className = "cta cta--filled";
		addVariant("outline", element, "cta");
		expect(element.className).toBe("cta cta--outline");
	});

	it("clears modifiers when given null", () => {
		const element = document.createElement("a");
		element.className = "cta cta--filled";
		addVariant(null, element, "cta");
		expect(element.className).toBe("cta");
	});
});

describe("updateLinkIcon", () => {
	const origin = "https://example.yale.edu";
	const linkTo = (href, target) => {
		const link = document.createElement("a");
		link.href = href;
		if (target) link.target = target;
		updateLinkIcon(null, link, origin);
		return link.querySelector(".fa-icon")?.ariaLabel ?? null;
	};

	it.each([
		["https://example.yale.edu/file.pdf?x=1#page=2", "(link is a download)"],
		["https://other.edu/page", "(link is external)"],
		["https://example.yale.edu/page", null],
		["mailto:someone@yale.edu", null],
	])("%s -> %s", (href, label) => {
		expect(linkTo(href)).toBe(label);
	});

	it("marks same-origin links that open a new window", () => {
		expect(linkTo("https://example.yale.edu/page", "_blank")).toBe("(opens in new window)");
	});

	it("marks external links that open a new window as opening a new window", () => {
		expect(linkTo("https://other.edu/page", "_blank")).toBe("(opens in new window)");
	});

	it("keeps the download icon on downloads that open a new window", () => {
		expect(linkTo("https://other.edu/file.pdf", "_blank")).toBe("(link is a download)");
	});

	it("keeps the icon on the same line as the last word", () => {
		const container = document.createElement("div");
		container.style.width = "0";
		const link = document.createElement("a");
		link.href = "https://other.edu/";
		link.textContent = "Alpha Beta";
		container.append(link);
		document.body.append(container);
		updateLinkIcon(null, link, origin);
		const range = document.createRange();
		range.setStart(link.firstChild, 6);
		range.setEnd(link.firstChild, 10);
		const word = range.getBoundingClientRect();
		const icon = link.querySelector(".fa-icon").getBoundingClientRect();
		expect(icon.top).toBeLessThan(word.bottom);
		expect(icon.bottom).toBeGreaterThan(word.top);
		// The text itself is untouched; only the hidden word joiner sits before the icon.
		expect(link.firstChild.data).toBe("Alpha Beta");
		expect(link.textContent).toBe("Alpha Beta\u2060");
		expect(link.querySelector("[aria-hidden]").textContent).toBe("\u2060");
		expect(link.querySelector(".fa-icon").closest("a")).toBe(link);
	});

	it("leaves one icon and no stray wrappers when run again", () => {
		const link = document.createElement("a");
		link.href = "https://other.edu/";
		link.textContent = "Out";
		for (let i = 0; i < 3; i++) updateLinkIcon(link.querySelector(".fa-icon"), link, origin);
		link.href = "https://example.yale.edu/page";
		updateLinkIcon(link.querySelector(".fa-icon"), link, origin);
		expect(link.children).toHaveLength(0);
		link.href = "https://other.edu/";
		updateLinkIcon(null, link, origin);
		expect(link.querySelectorAll(".fa-icon")).toHaveLength(1);
		expect(link.children).toHaveLength(1);
	});

	it("replaces the existing icon", () => {
		const link = document.createElement("a");
		link.href = "https://other.edu/";
		updateLinkIcon(null, link, origin);
		link.href = "https://example.yale.edu/report.docx";
		updateLinkIcon(link.querySelector(".fa-icon"), link, origin);
		expect(link.querySelectorAll(".fa-icon")).toHaveLength(1);
		expect(link.querySelector(".fa-icon").ariaLabel).toBe("(link is a download)");
	});
});
