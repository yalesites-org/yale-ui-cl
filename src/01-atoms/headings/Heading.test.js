import { describe, it, expect } from "vitest";
import { mount } from "../../../test/helpers.js";
import "./Heading.js";

// 52 characters, the length from the issue: wider than a phone screen at every heading level.
const longWord = "Pneumonoultramicroscopicsilicovolcanoconiosisxxxxxxx";
const levels = ["1", "2", "3", "4", "5", "6"];
const headings = (text) => levels.map((level) => `<ycl-heading level="${level}">${text}</ycl-heading>`).join("");

describe("ycl-heading long words", () => {
	for (const width of [360, 375]) {
		it(`breaks an unbroken word inside ${width}px at every level`, () => {
			const box = mount(`<div style="width: ${width}px">${headings(longWord)}</div>`);
			expect(box.scrollWidth).toBeLessThanOrEqual(width);
		});
	}

	it("leaves the min-content width of normal headings at their longest word, at every level", () => {
		// break-word (not anywhere) only breaks words that overflow, so a heading squeezed to
		// min-content still wraps between words, never inside one.
		for (const level of levels) {
			const squeezed = mount(`<div style="width: min-content"><ycl-heading level="${level}">Yale University</ycl-heading></div>`);
			const word = mount(`<div style="width: max-content"><ycl-heading level="${level}">University</ycl-heading></div>`);
			expect(squeezed.getBoundingClientRect().width).toBeCloseTo(word.getBoundingClientRect().width, 0);
		}
	});
});
