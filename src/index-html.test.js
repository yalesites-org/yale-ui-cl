import { describe, it, expect } from "vitest";
import indexHtml from "../index.html?raw";

// The index.html harness is the quickest way to eyeball components, so its markup must use the
// current options API: ycl-cta-link takes attributes, and no longer reads `class`.
const doc = new DOMParser().parseFromString(indexHtml, "text/html");
const ctaLinks = [...doc.querySelectorAll("ycl-cta-link")];

describe("index.html demo markup", () => {
	it("has CTA links to check", () => {
		expect(ctaLinks.length).toBeGreaterThan(0);
	});

	it("sets ycl-cta-link options with attributes, not class", () => {
		const withClass = ctaLinks.filter((el) => el.hasAttribute("class")).map((el) => el.textContent.trim());
		expect(withClass).toEqual([]);
	});

	it("only uses animate values that cta.css defines", () => {
		const animates = ctaLinks.filter((el) => el.hasAttribute("animate")).map((el) => el.getAttribute("animate"));
		for (const value of animates) expect(["none", "rise", "wipe"]).toContain(value);
	});
});
