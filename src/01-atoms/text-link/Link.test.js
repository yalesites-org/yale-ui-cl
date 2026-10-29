import { describe, expect, it } from "vitest";
import "./Link.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const link = (element) => shadowOf(element).querySelector("a");

describe("text-link", () => {
	it("forwards href, target and variants to the inner link", () => {
		const element = mount(`<text-link href="/about" target="_self" class="subtle">About</text-link>`);
		expect(link(element).getAttribute("href")).toBe("/about");
		expect(link(element).target).toBe("_self");
		expect(link(element).classList).toContain("link--subtle");
	});

	it("labels external links and keeps a single icon as href changes", () => {
		const element = mount(`<text-link href="https://example.com/">Out</text-link>`);
		expect(link(element).querySelector(".fa-icon").ariaLabel).toBe("(link is external)");
		element.href = "https://example.com/doc.pdf";
		expect(link(element).querySelectorAll(".fa-icon")).toHaveLength(1);
		expect(link(element).querySelector(".fa-icon").ariaLabel).toBe("(link is a download)");
	});
});

describe("text-link icon wrapping", () => {
	it("keeps the new-window icon on the same line as the last word", () => {
		const element = mount(
			`<div style="width: 0"><text-link href="https://example.com/" target="_blank">Read the full report</text-link></div>`,
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
