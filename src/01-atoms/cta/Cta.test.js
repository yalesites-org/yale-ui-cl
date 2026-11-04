import { describe, expect, it } from "vitest";
import "./Cta.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const link = (element) => shadowOf(element).querySelector("a");
const style = (element) => getComputedStyle(link(element));

describe("ycl-cta-link", () => {
	it("maps option attributes to CTA modifiers", () => {
		const element = mount(`<ycl-cta-link href="/" variant="outline" outline-weight="4" animate="wipe" radius="pill">Go</ycl-cta-link>`);
		expect(link(element).className).toBe("cta cta--outline cta--outline-weight-4 cta--animate-wipe cta--radius-pill");
	});

	it("drops a modifier when its attribute is removed, and ignores host classes", () => {
		const element = mount(`<ycl-cta-link href="/" class="filled" variant="filled" animate="rise">Go</ycl-cta-link>`);
		element.removeAttribute("animate");
		expect(link(element).className).toBe("cta cta--filled");
	});

	it("ignores the removed size attribute and secondary variant", () => {
		const element = mount(`<ycl-cta-link href="/" variant="secondary" size="large">Go</ycl-cta-link>`);
		expect(link(element).className).toBe("cta");
	});

	it("only accepts outline weights 1, 2 and 4", () => {
		const element = mount(`<ycl-cta-link href="/" variant="outline" outline-weight="3">Go</ycl-cta-link>`);
		expect(link(element).className).toBe("cta cta--outline");
		element.setAttribute("outline-weight", "1");
		expect(link(element).className).toBe("cta cta--outline cta--outline-weight-1");
	});

	it("draws a thicker border for a heavier outline weight", () => {
		const thin = mount(`<ycl-cta-link href="/" variant="outline" outline-weight="1">Go</ycl-cta-link>`);
		const standard = mount(`<ycl-cta-link href="/" variant="outline">Go</ycl-cta-link>`);
		const thick = mount(`<ycl-cta-link href="/" variant="outline" outline-weight="4">Go</ycl-cta-link>`);
		const width = (element) => parseFloat(style(element).borderTopWidth);
		expect(width(thin)).toBeLessThan(width(standard));
		expect(width(standard)).toBeLessThan(width(thick));
	});

	it("is filled when no variant is set, and outline only when asked", () => {
		const plain = mount(`<ycl-cta-link href="/">Go</ycl-cta-link>`);
		const outline = mount(`<ycl-cta-link href="/" variant="outline">Go</ycl-cta-link>`);
		expect(style(plain).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
		expect(style(plain).backgroundColor).toBe(style(plain).borderTopColor);
		expect(style(outline).backgroundColor).toBe("rgba(0, 0, 0, 0)");
	});

	it("uses the YaleSites CTA box and type", () => {
		const s = style(mount(`<ycl-cta-link href="/">Go</ycl-cta-link>`));
		expect(s.paddingLeft).toBe("24px");
		expect(s.paddingRight).toBe("24px");
		expect(s.paddingTop).toBe("8px");
		expect(s.paddingBottom).toBe("8px");
		expect(s.minHeight).toBe("44px");
		expect(s.fontWeight).toBe("500");
	});

	it("inherits its font family from the page", () => {
		const wrapper = mount(`<div style="font-family: TestFont, serif"><ycl-cta-link href="/">Go</ycl-cta-link></div>`);
		const element = wrapper.querySelector("ycl-cta-link");
		expect(style(element).fontFamily).toBe(getComputedStyle(wrapper).fontFamily);
	});
});
