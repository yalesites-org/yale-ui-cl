import { describe, it, expect } from "vitest";
import { mount, shadowOf } from "../../../test/helpers.js";
import "./InlineMessage.js";

const landmark = (el) => shadowOf(el).querySelector("section");

describe("ycl-inline-message label", () => {
	it("names its landmark \"information\" by default", () => {
		const el = mount(`<ycl-inline-message><p>Text</p></ycl-inline-message>`);
		expect(landmark(el).getAttribute("aria-label")).toBe("information");
	});

	it("uses an author-set label as the landmark name", () => {
		const el = mount(`<ycl-inline-message label="Parking update"><p>Text</p></ycl-inline-message>`);
		expect(landmark(el).getAttribute("aria-label")).toBe("Parking update");
	});

	it("follows a label set through the property", () => {
		const el = mount(`<ycl-inline-message><p>Text</p></ycl-inline-message>`);
		el.label = "Library hours";
		expect(el.getAttribute("label")).toBe("Library hours");
		expect(landmark(el).getAttribute("aria-label")).toBe("Library hours");
	});

	it("falls back to the default when the label is emptied", () => {
		const el = mount(`<ycl-inline-message label="Library hours"><p>Text</p></ycl-inline-message>`);
		el.setAttribute("label", "");
		expect(landmark(el).getAttribute("aria-label")).toBe("information");
	});

	it("falls back to the default when the label is removed", () => {
		const el = mount(`<ycl-inline-message label="Library hours"><p>Text</p></ycl-inline-message>`);
		el.label = null;
		expect(el.hasAttribute("label")).toBe(false);
		expect(landmark(el).getAttribute("aria-label")).toBe("information");
	});
});
