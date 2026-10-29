import { describe, expect, it } from "vitest";
import axe from "axe-core";
import "./TaxonomyDisplay.js";
import { mount } from "../../../test/helpers.js";

describe("ycl-taxonomy-display-item", () => {
	it("reflects the listitem role on its host", () => {
		const item = mount(`<ycl-taxonomy-display-item label="Topics"></ycl-taxonomy-display-item>`);
		expect(item.getAttribute("role")).toBe("listitem");
	});

	it("keeps a role the author set", () => {
		const item = mount(`<ycl-taxonomy-display-item role="none"></ycl-taxonomy-display-item>`);
		expect(item.getAttribute("role")).toBe("none");
	});
});

describe("ycl-taxonomy-display", () => {
	it("gives its list the list items axe expects", async () => {
		const display = mount(`<ycl-taxonomy-display>
			<ycl-taxonomy-display-item label="Topics"><a href="#a">Arts</a></ycl-taxonomy-display-item>
			<ycl-taxonomy-display-item label="Tags"><a href="#b">News</a></ycl-taxonomy-display-item>
		</ycl-taxonomy-display>`);
		const { violations } = await axe.run(display, { runOnly: ["aria-required-children", "aria-required-parent"] });
		expect(violations).toEqual([]);
	});
});
