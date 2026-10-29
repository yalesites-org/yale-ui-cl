import { describe, expect, it } from "vitest";
import "./Cta.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const link = (element) => shadowOf(element).querySelector("a");

describe("cta-link", () => {
	it.each(["small", "medium", "large"])("centres the link icon without growing the %s CTA", (size) => {
		const element = mount(`<cta-link href="https://example.com/" class="${size}">Visit the site</cta-link>`);
		const anchor = link(element);
		const icon = anchor.querySelector(".fa-icon");
		expect(icon.ariaLabel).toBe("(link is external)");

		const box = anchor.getBoundingClientRect();
		const style = getComputedStyle(anchor);
		const contentTop = box.top + parseFloat(style.borderTopWidth) + parseFloat(style.paddingTop);
		const contentBottom = box.bottom - parseFloat(style.borderBottomWidth) - parseFloat(style.paddingBottom);
		const iconBox = icon.getBoundingClientRect();

		// The 1rem icon is the tallest thing in the CTA, so it should fill the content box exactly.
		expect(contentBottom - contentTop).toBeCloseTo(iconBox.height, 1);
		expect(iconBox.top + iconBox.height / 2).toBeCloseTo((contentTop + contentBottom) / 2, 1);
	});
});
