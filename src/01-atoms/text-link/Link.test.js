import { describe, expect, it } from "vitest";
import "./Link.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const link = (element) => shadowOf(element).querySelector("a");

describe("ycl-text-link", () => {
	it("forwards href, and target to the inner link", () => {
		const element = mount(`<ycl-text-link href="/about" target="_self">About</ycl-text-link>`);
		expect(link(element).getAttribute("href")).toBe("/about");
		expect(link(element).target).toBe("_self");
	});

	it("labels external links and keeps a single icon as href changes", () => {
		const element = mount(`<ycl-text-link href="https://example.com/">Out</ycl-text-link>`);
		expect(link(element).querySelector(".fa-icon").ariaLabel).toBe("(link is external)");
		element.href = "https://example.com/doc.pdf";
		expect(link(element).querySelectorAll(".fa-icon")).toHaveLength(1);
		expect(link(element).querySelector(".fa-icon").ariaLabel).toBe("(link is a download)");
	});

	it("reflects the link style, defaulting to underline", () => {
		const element = mount(`<ycl-text-link href="/about">About</ycl-text-link>`);
		expect(link(element).dataset.linkStyle).toBe("underline");
		element.setAttribute("link-style", "no-underline");
		expect(link(element).dataset.linkStyle).toBe("no-underline");
		element.setAttribute("link-style", "no-animation");
		expect(link(element).dataset.linkStyle).toBe("no-animation");
		element.removeAttribute("link-style");
		expect(link(element).dataset.linkStyle).toBe("underline");
	});

	it("shows a chevron in place of the link-type icon", () => {
		const element = mount(`<ycl-text-link href="https://example.com/" chevron>Next</ycl-text-link>`);
		const shown = () => [...link(element).querySelectorAll(".fa-icon")];
		expect(shown()).toHaveLength(1);
		expect(shown()[0].classList).toContain("link__chevron");
		expect(shown()[0].getAttribute("aria-hidden")).toBe("true");
		element.removeAttribute("chevron");
		expect(shown()).toHaveLength(1);
		expect(shown()[0].ariaLabel).toBe("(link is external)");
	});
});

describe("text-link icon wrapping", () => {
	it("keeps the new-window icon on the same line as the last word", () => {
		const element = mount(
			`<div style="width: 0"><ycl-text-link href="https://example.com/" target="_blank">Read the full report</ycl-text-link></div>`,
		).firstElementChild;
		const icon = link(element).querySelector(".fa-icon");
		expect(icon.ariaLabel).toBe("(opens in new window)");

		const text = element.firstChild;
		const range = document.createRange();
		range.setStart(text, text.data.lastIndexOf(" ") + 1);
		range.setEnd(text, text.data.length);
		const lastWord = range.getBoundingClientRect();
		const firstWord = element.getClientRects()[0];
		const iconBox = icon.getBoundingClientRect();

		// The narrow container puts every word on its own line, so the test would pass vacuously otherwise.
		expect(lastWord.top).toBeGreaterThan(firstWord.bottom - 1);
		// Same line: the icon's vertical extent overlaps the last word's line box.
		expect(iconBox.top).toBeLessThan(lastWord.bottom);
		expect(iconBox.bottom).toBeGreaterThan(lastWord.top);
		expect(iconBox.left).toBeGreaterThanOrEqual(lastWord.right - 1);
	});
});
