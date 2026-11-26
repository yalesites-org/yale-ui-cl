import { describe, expect, it } from "vitest";
import "./TaxonomyDisplay.js";
import { mount } from "../../../test/helpers.js";

describe("ycl-taxonomy-display", () => {
	it("is a list, so axe sees its items' parent", () => {
		const list = mount(`<ycl-taxonomy-display><ycl-taxonomy-display-item label="Tags"></ycl-taxonomy-display-item></ycl-taxonomy-display>`);
		expect(list.getAttribute("role")).toBe("list");
	});
});

describe("ycl-taxonomy-display-item", () => {
	it("is a listitem, as an attribute axe can see", () => {
		const item = mount(`<ycl-taxonomy-display-item label="Tags"></ycl-taxonomy-display-item>`);
		expect(item.getAttribute("role")).toBe("listitem");
	});

	it("keeps a role the author set", () => {
		const item = mount(`<ycl-taxonomy-display-item role="none" label="Tags"></ycl-taxonomy-display-item>`);
		expect(item.getAttribute("role")).toBe("none");
	});
});
