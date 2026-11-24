import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
// The size and color tokens live on :root in the document stylesheet consumers load, so load them
// here too; without them --size-spacing-8 is undefined and the svg falls back to its intrinsic size.
import "@yalesites-org/tokens/build/css/tokens.css";
import "./Wordmark.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const named = (element) => shadowOf(element).querySelectorAll("[aria-label]");

const svgBox = (element) => shadowOf(element).querySelector("svg").getBoundingClientRect();
const rootFontSize = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
const VIEWBOX_RATIO = 106 / 46;

describe("ycl-wordmark", () => {
	it("renders the wordmark as an inline, hidden svg", () => {
		const element = mount(`<ycl-wordmark></ycl-wordmark>`);
		const svg = shadowOf(element).querySelector("svg");
		expect(svg.getAttribute("viewBox")).toBe("0 0 106 46");
		expect(svg.getAttribute("aria-hidden")).toBe("true");
		expect(svg.querySelector("path").getAttribute("d")).toMatch(/^M35\.3644068,9\.76153846/);
		expect(svg.querySelector("path").getAttribute("fill")).toBe("currentColor");
	});

	it("links to yale.edu by default, and the link carries the only name", () => {
		const element = mount(`<ycl-wordmark></ycl-wordmark>`);
		const link = shadowOf(element).querySelector("a");
		expect(link.getAttribute("href")).toBe("https://www.yale.edu");
		expect(link.getAttribute("aria-label")).toBe("Yale University");
		expect(named(element)).toHaveLength(1);
		expect(element.href).toBe("https://www.yale.edu");
	});

	it("applies a custom href", () => {
		const element = mount(`<ycl-wordmark href="/home"></ycl-wordmark>`);
		expect(shadowOf(element).querySelector("a").getAttribute("href")).toBe("/home");
		expect(element.href).toBe("/home");
	});

	it("renders no link for an empty href but stays named as an image", () => {
		const element = mount(`<ycl-wordmark href=""></ycl-wordmark>`);
		expect(shadowOf(element).querySelector("a")).toBeNull();
		const labelled = named(element);
		expect(labelled).toHaveLength(1);
		expect(labelled[0].getAttribute("role")).toBe("img");
		expect(labelled[0].getAttribute("aria-label")).toBe("Yale University");
	});

	it("updates the link when href changes at runtime", () => {
		const element = mount(`<ycl-wordmark></ycl-wordmark>`);
		element.href = "/about";
		expect(shadowOf(element).querySelector("a").getAttribute("href")).toBe("/about");
		element.href = "";
		expect(shadowOf(element).querySelector("a")).toBeNull();
		element.removeAttribute("href");
		expect(shadowOf(element).querySelector("a").getAttribute("href")).toBe("https://www.yale.edu");
		expect(named(element)).toHaveLength(1);
	});

	it("restores the default link when href is set to null or undefined", () => {
		for (const value of [null, undefined]) {
			const element = mount(`<ycl-wordmark href=""></ycl-wordmark>`);
			element.href = value;
			expect(element.hasAttribute("href")).toBe(false);
			expect(element.href).toBe("https://www.yale.edu");
			expect(shadowOf(element).querySelector("a").getAttribute("href")).toBe("https://www.yale.edu");
		}
		const element = mount(`<ycl-wordmark></ycl-wordmark>`);
		element.href = "";
		expect(element.getAttribute("href")).toBe("");
		expect(shadowOf(element).querySelector("a")).toBeNull();
	});

	it("keeps the same focused link when href changes between links", async () => {
		document.body.replaceChildren();
		const element = mount(`<ycl-wordmark></ycl-wordmark>`);
		const link = shadowOf(element).querySelector("a");
		await userEvent.tab();
		expect(link.matches(":focus")).toBe(true);
		element.href = "/about";
		expect(shadowOf(element).querySelector("a")).toBe(link);
		expect(link.getAttribute("href")).toBe("/about");
		expect(link.matches(":focus")).toBe(true);
		element.removeAttribute("href");
		expect(shadowOf(element).querySelector("a")).toBe(link);
		expect(link.getAttribute("href")).toBe("https://www.yale.edu");
		expect(link.matches(":focus")).toBe(true);
	});

	it("switches color between blue-yale and white", () => {
		const blue = mount(`<ycl-wordmark></ycl-wordmark>`);
		const white = mount(`<ycl-wordmark color="white"></ycl-wordmark>`);
		const color = (element) => getComputedStyle(shadowOf(element).querySelector("svg")).color;
		expect(white.getAttribute("color")).toBe("white");
		expect(color(white)).toBe("rgb(255, 255, 255)");
		expect(color(blue)).not.toBe(color(white));
	});

	it("draws the keyboard focus ring in the wordmark's own color", async () => {
		for (const [markup, expected] of [
			[`<ycl-wordmark></ycl-wordmark>`, null],
			[`<ycl-wordmark color="white"></ycl-wordmark>`, "rgb(255, 255, 255)"],
		]) {
			document.body.replaceChildren();
			const element = mount(markup);
			const link = shadowOf(element).querySelector("a");
			await userEvent.tab();
			expect(link.matches(":focus-visible")).toBe(true);
			const style = getComputedStyle(link);
			if (expected) expect(style.color).toBe(expected);
			expect(style.outlineColor).toBe(style.color);
		}
	});

	it("sizes the svg to the --size-spacing-8 token by default, width following the viewBox", () => {
		const element = mount(`<ycl-wordmark></ycl-wordmark>`);
		const svg = shadowOf(element).querySelector("svg");
		const token = getComputedStyle(svg).getPropertyValue("--size-spacing-8").trim();
		expect(token).toMatch(/rem$/);
		const expected = parseFloat(token) * rootFontSize();
		expect(getComputedStyle(svg).height).toBe(`${expected}px`);
		const { width, height } = svgBox(element);
		expect(height).toBeCloseTo(expected, 1);
		expect(width).toBeGreaterThan(0);
		expect(width / height).toBeCloseTo(VIEWBOX_RATIO, 2);
	});

	it("lets --size-wordmark on the host override the height, scaling the width with it", () => {
		const element = mount(`<ycl-wordmark></ycl-wordmark>`);
		const before = svgBox(element);
		element.style.setProperty("--size-wordmark", "4rem");
		const svg = shadowOf(element).querySelector("svg");
		const expected = 4 * rootFontSize();
		expect(getComputedStyle(svg).height).toBe(`${expected}px`);
		const { width, height } = svgBox(element);
		expect(height).toBeCloseTo(expected, 1);
		expect(width / height).toBeCloseTo(VIEWBOX_RATIO, 2);
		expect(width / before.width).toBeCloseTo(expected / before.height, 2);
	});
});
