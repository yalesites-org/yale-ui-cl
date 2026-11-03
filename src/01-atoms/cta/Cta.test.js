import { describe, expect, it } from "vitest";
import "./Cta.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const link = (element) => shadowOf(element).querySelector("a");

describe("ycl-cta-link", () => {
	it("maps option attributes to CTA modifiers", () => {
		const element = mount(`<ycl-cta-link href="/" variant="outline" size="large" animate="wipe" radius="pill">Go</ycl-cta-link>`);
		expect(link(element).className).toBe("cta cta--outline cta--large cta--animate-wipe cta--radius-pill");
	});

	it("drops a modifier when its attribute is removed, and ignores host classes", () => {
		const element = mount(`<ycl-cta-link href="/" class="filled" variant="filled" animate="rise">Go</ycl-cta-link>`);
		element.removeAttribute("animate");
		expect(link(element).className).toBe("cta cta--filled");
	});
});
