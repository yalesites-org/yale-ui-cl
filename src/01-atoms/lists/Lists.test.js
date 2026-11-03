import { describe, expect, it } from "vitest";
import "./Lists.js";
import { mount } from "../../../test/helpers.js";

const list = (element) => element.querySelector("ul");

describe("ycl-list", () => {
	it("styles the slotted list as a taxonomy list from its type", () => {
		const element = mount(`<ycl-list type="tags"><ul><li>A</li><li>B</li></ul></ycl-list>`);
		expect(list(element).classList).toContain("taxonomy-list--tags");
		expect(list(element).querySelectorAll(".taxonomy-list__divider")).toHaveLength(2);
	});

	it("re-renders without stacking dividers when the type changes, and resets on an unknown type", () => {
		const element = mount(`<ycl-list type="tags"><ul><li>A</li></ul></ycl-list>`);
		element.setAttribute("type", "categories");
		expect(list(element).className).toBe("taxonomy-list taxonomy-list--categories");
		expect(list(element).querySelectorAll(".taxonomy-list__divider")).toHaveLength(1);
		element.setAttribute("type", "other");
		expect(list(element).className).toBe("");
	});
});
