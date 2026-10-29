import { describe, expect, it } from "vitest";
import { addVariant, updateLinkIcon } from "./utility.js";

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
