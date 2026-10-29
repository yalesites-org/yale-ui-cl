import { describe, expect, it } from "vitest";
import "../01-atoms/text-input/TextInput.js";
import "../01-atoms/divider/Divider.js";
import "../02-molecules/accordions/Accordion.js";
import "../02-molecules/alert/Alert.js";
import "../02-molecules/callout/Callout.js";
import "../02-molecules/image/ImageBlock.js";
import "../02-molecules/inline-message/InlineMessage.js";
import "../02-molecules/page-title/PageTitle.js";
import "../02-molecules/pull-quote/PullQuote.js";
import "../02-molecules/quote-callout/QuoteCallout.js";
import "../02-molecules/related-content/RelatedContent.js";
import "../02-molecules/text-with-image/TextWithImage.js";
import { mount, shadowOf } from "../../test/helpers.js";

const rem = (n) => `${n * parseFloat(getComputedStyle(document.documentElement).fontSize)}px`;
const atLeast = (px) => matchMedia(`(min-width: ${px}px)`).matches;

describe("shared shadow styles", () => {
	it("sizes shadow content with border-box", () => {
		const input = mount(`<text-input label="Name"></text-input>`);
		const root = shadowOf(input);
		const field = root.querySelector(".form-item__textfield");
		expect(getComputedStyle(field).boxSizing).toBe("border-box");
		expect(getComputedStyle(root.querySelector(".form-item")).boxSizing).toBe("border-box");
		expect(field.getBoundingClientRect().width).toBeLessThanOrEqual(root.querySelector(".form-item").getBoundingClientRect().width);
	});

	it.each(["ycl-inline-message", "ycl-quote-callout", "ycl-alert", "ycl-text-with-image"])(
		"%s spaces slotted paragraphs like YaleSites",
		(tag) => {
			const element = mount(`<${tag}><p>One</p><p>Two</p><p>Three</p></${tag}>`);
			const [first, middle, last] = element.querySelectorAll("p").values().map(getComputedStyle);
			expect(first.marginTop).toBe("0px");
			expect(middle.marginTop).toBe("0px");
			expect(middle.marginBottom).toBe(middle.fontSize);
			expect(last.marginBottom).toBe("0px");
		},
	);
});

// YaleSites' --spacing-page-section and --spacing-component-banner, by breakpoint.
const pageSection = () => (atLeast(992) ? rem(4) : rem(2.5));
const banner = () => rem(atLeast(1400) ? 6 : atLeast(1200) ? 5 : atLeast(992) ? 4 : 3);
// YaleSites' --size-spacing-site-gutter.
const gutter = () => rem(atLeast(1400) ? 4 : atLeast(1200) ? 2.5 : atLeast(992) ? 2 : atLeast(768) ? 1.5 : 1);

describe("page section spacing", () => {
	it.each([
		["ycl-divider", pageSection, pageSection],
		["ycl-accordion", pageSection, pageSection],
		["ycl-pull-quote", pageSection, pageSection],
		["ycl-related-content", () => rem(4), pageSection],
		["ycl-callout", banner, banner],
	])("%s", (tag, top, bottom) => {
		const style = getComputedStyle(mount(`<${tag}></${tag}>`));
		expect(style.marginTop).toBe(top());
		expect(style.marginBottom).toBe(bottom());
	});
});

describe("site gutter", () => {
	it.each([
		["ycl-image-block", ".content-image"],
		["ycl-page-title", ".page-title"],
	])("%s", (tag, selector) => {
		const style = getComputedStyle(shadowOf(mount(`<${tag}></${tag}>`)).querySelector(selector));
		expect(style.paddingLeft).toBe(gutter());
		expect(style.paddingRight).toBe(gutter());
	});
});
