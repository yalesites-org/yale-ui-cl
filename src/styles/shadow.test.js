import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import "../01-atoms/text-input/TextInput.js";
import "../01-atoms/divider/Divider.js";
import "../02-molecules/accordions/Accordion.js";
import "../02-molecules/embed/Embed.js";
import "../02-molecules/alert/Alert.js";
import "../02-molecules/callout/Callout.js";
import "../02-molecules/image/ImageBlock.js";
import "../02-molecules/inline-message/InlineMessage.js";
import "../02-molecules/modal/Modal.js";
import "../02-molecules/page-title/PageTitle.js";
import "../02-molecules/pull-quote/PullQuote.js";
import "../02-molecules/quick-links/QuickLinks.js";
import "../02-molecules/quote-callout/QuoteCallout.js";
import "../02-molecules/related-content/RelatedContent.js";
import "../02-molecules/video/Video.js";
import "../02-molecules/wrapped-image/WrappedImage.js";
import "../03-organisms/banner/action/ActionBanner.js";
import "../03-organisms/content-spotlight-portrait/ContentSpotlightPortrait.js";
import "../03-organisms/text-with-image/TextWithImage.js";
import { mount, shadowOf } from "../../test/helpers.js";

const rem = (n) => `${n * parseFloat(getComputedStyle(document.documentElement).fontSize)}px`;
const atLeast = (px) => matchMedia(`(min-width: ${px}px)`).matches;

describe("shared shadow styles", () => {
	it("sizes shadow content with border-box", () => {
		const input = mount(`<ycl-text-input label="Name"></ycl-text-input>`);
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

// One width in each gutter step: below 768px, then 768, 992, 1200 and 1400px and up.
const gutterWidths = [375, 800, 1000, 1250, 1500];

// Each component that uses the gutter: its shadow part, the properties it sets from the gutter,
// and the values they take for a gutter of g pixels.
const sides = (style) => [style.paddingLeft, style.paddingRight];
const gutterUses = [
	...[
		["ycl-image-block", ".content-image"],
		["ycl-page-title", ".page-title"],
		["ycl-alert", ".alert"],
		["ycl-accordion", ".accordion"],
		["ycl-video", ".video"],
		["ycl-embed", ".embed"],
		["ycl-quick-links", ".quick-links"],
		["ycl-wrapped-image", ".wrapped-image"],
		["ycl-text-with-image", ".text-with-image"],
		["ycl-content-spotlight-portrait", ".content-spotlight-portrait"],
	].map(([tag, selector]) => [tag, selector, sides, (g) => [`${g}px`, `${g}px`]]),
	// The action banner pads its text with the gutter only from 992px; below that it keeps 2rem.
	["ycl-action-banner", ".cta-banner__wrap", sides, (g) => (atLeast(992) ? [`${g}px`, `${g}px`] : [rem(2), rem(2)])],
	["ycl-modal", ".modal", (style) => [style.maxHeight], (g) => [`${innerHeight - g}px`]],
];

// Computed style of a shadow part. A gutter given here is set inside the shadow root, unlayered so
// it beats shadow.css, which shows the component reads the shared value rather than its own copy.
const shadowStyle = (tag, selector, gutterValue) => {
	const root = shadowOf(mount(`<${tag}></${tag}>`));
	if (gutterValue) {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(`:host { --size-spacing-site-gutter: ${gutterValue}; }`);
		root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
	}
	return getComputedStyle(root.querySelector(selector));
};

describe("site gutter", () => {
	it("every component takes the shared gutter at every breakpoint", async () => {
		const { innerWidth: startWidth, innerHeight: startHeight } = window;
		try {
			for (const width of gutterWidths) {
				await page.viewport(width, 900);
				for (const [tag, selector, read, expected] of gutterUses) {
					expect.soft(read(shadowStyle(tag, selector)), `${tag} at ${width}px`).toEqual(expected(parseFloat(gutter())));
					expect.soft(read(shadowStyle(tag, selector, "7px")), `${tag} at ${width}px, gutter 7px`).toEqual(expected(7));
				}
			}
		} finally {
			await page.viewport(startWidth, startHeight);
		}
	});
});
