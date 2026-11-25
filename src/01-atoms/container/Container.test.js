import { describe, expect, it } from "vitest";
import "./Container.js";
import { gutter, mount, pageSection, rem, shadowOf } from "../../../test/helpers.js";

// The --size-component-layout-width-* tokens, in rem.
const widths = { site: 84, content: 56, highlight: 70, max: 100 };

const style = (element) => getComputedStyle(element);
const px = (value) => parseFloat(value);

describe("ycl-container", () => {
	it("renders its children through a slot", () => {
		const element = mount(`<ycl-container><p>Inside</p></ycl-container>`);
		const slot = shadowOf(element).querySelector("slot");
		expect(slot.assignedElements()).toEqual([element.querySelector("p")]);
	});

	it("pads its sides with the site gutter", () => {
		const element = mount(`<ycl-container></ycl-container>`);
		expect(style(element).paddingLeft).toBe(gutter());
		expect(style(element).paddingRight).toBe(gutter());
	});

	it.each([
		...Object.keys(widths).map((width) => [width, width, width]),
		["no", undefined, "site"],
		["an unknown", "huge", "site"],
	])("caps the content for %s width at the matching layout width", (_, width, expected) => {
		const element = mount(width ? `<ycl-container width="${width}"></ycl-container>` : `<ycl-container></ycl-container>`);
		expect(px(style(element).maxWidth)).toBe(px(rem(widths[expected])) + 2 * px(gutter()));
	});

	it("has no width cap when full", () => {
		const element = mount(`<ycl-container width="full"></ycl-container>`);
		expect(style(element).maxWidth).toBe("none");
	});

	it("centers itself in a wider parent", () => {
		const element = mount(`<div style="width: 3000px"><ycl-container width="content"></ycl-container></div>`).firstElementChild;
		const { left, right } = element.getBoundingClientRect();
		const parent = element.parentElement.getBoundingClientRect();
		expect(left - parent.left).toBeCloseTo(parent.right - right, 0);
		expect(left - parent.left).toBeGreaterThan(0);
	});

	it("adds no vertical spacing by default", () => {
		const element = mount(`<ycl-container></ycl-container>`);
		expect(style(element).paddingTop).toBe("0px");
		expect(style(element).paddingBottom).toBe("0px");
	});

	it("adds page section spacing above and below with spacing=\"section\"", () => {
		const element = mount(`<ycl-container spacing="section"></ycl-container>`);
		expect(style(element).paddingTop).toBe(pageSection());
		expect(style(element).paddingBottom).toBe(pageSection());
	});

	it("drops the gutter with gutter=\"none\"", () => {
		const element = mount(`<ycl-container gutter="none" width="content"></ycl-container>`);
		expect(style(element).paddingLeft).toBe("0px");
		expect(style(element).paddingRight).toBe("0px");
		expect(style(element).maxWidth).toBe(rem(widths.content));
	});
});
