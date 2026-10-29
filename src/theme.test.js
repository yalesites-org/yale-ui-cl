import { describe, expect, it } from "vitest";
import "./main.js";
import { composedElements, mount, settle, shadowOf } from "../test/helpers.js";

// The single colour theme: pages set these five inherited custom properties (or leave them unset
// for the Old Blues defaults) and components pick one with their theme attribute.
// This file deliberately doesn't load base.css: themes must work from the shadow-root styles alone.
const PALETTE = ["primary", "secondary", "tertiary", "accent-1", "accent-2"];

// The colour options each themed component offers, default first. "default" is a component's
// unthemed look where it has one.
const OPTIONS = {
	"ycl-accordion": ["default", "primary", "secondary", "tertiary", "accent-1", "accent-2"],
	"ycl-action-banner": ["primary", "accent-1", "accent-2", "tertiary", "secondary"],
	"ycl-image-banner": ["primary", "accent-1", "accent-2", "tertiary", "secondary"],
	"ycl-callout": ["primary", "accent-1", "accent-2", "tertiary", "secondary"],
	"ycl-content-spotlight-portrait": ["default", "primary", "accent-1", "accent-2", "tertiary", "secondary"],
	"ycl-facts-and-figures": ["primary", "secondary", "tertiary", "accent-1", "accent-2", "default"],
	"ycl-inline-message": ["accent-1", "primary", "secondary", "tertiary", "accent-2"],
	"ycl-link-grid": ["primary", "tertiary", "accent-2", "accent-1", "secondary"],
	"ycl-pull-quote": ["primary", "tertiary", "accent-2"],
	"ycl-quick-links": ["primary", "accent-1", "accent-2"],
	"ycl-quote-callout": ["primary", "tertiary", "accent-2", "accent-1", "secondary"],
	"ycl-tabs": ["primary", "secondary", "accent-2"],
	"ycl-taxonomy-display": ["default", "primary", "accent-1", "accent-2", "tertiary", "secondary"],
	"ycl-text-with-image": ["default", "primary", "accent-1", "accent-2", "tertiary", "secondary"],
	"ycl-tile-item": ["primary", "secondary", "tertiary", "accent-1", "accent-2"],
	"ycl-wrapped-callout": ["primary", "default", "secondary", "tertiary", "accent-1", "accent-2"],
};

const stories = Object.values(import.meta.glob("./0*/**/*.stories.js", { eager: true }));
const storyFor = (tag) => stories.find((module) => module.default.component === tag);

const css = import.meta.glob("./**/*.css", { query: "?raw", import: "default", eager: true });

// Resolves any CSS colour to the rgb() string getComputedStyle reports.
function rgb(color) {
	const probe = document.createElement("span");
	probe.style.color = color;
	document.body.append(probe);
	const value = getComputedStyle(probe).color;
	probe.remove();
	return value;
}

// All colours painted anywhere in the component.
function paintedColors(root) {
	const colors = new Set();
	for (const el of composedElements(root)) {
		// Accents are often drawn by pseudo-elements, e.g. a pull quote's bar.
		for (const style of [getComputedStyle(el), getComputedStyle(el, "::before"), getComputedStyle(el, "::after")]) {
			for (const prop of ["background-color", "color", "border-left-color", "border-top-color", "border-bottom-color", "fill"]) {
				colors.add(style.getPropertyValue(prop));
			}
		}
	}
	return colors;
}

function render(tag, theme) {
	const story = storyFor(tag);
	const meta = story.default;
	const args = { ...meta.args, ...(theme && { theme }) };
	return meta.render(args);
}

describe("single colour theme", () => {
	it("leaves no global themes or numbered theme options in component styles", () => {
		for (const [file, source] of Object.entries(css)) {
			expect(source, file).not.toMatch(/data-global-theme|global-themes-|component-themes-|color-slot-/);
			expect(source, file).not.toMatch(/theme="(one|two|three|four|five|six)"/);
		}
	});

	it("offers the palette names as each component's colour options in Storybook", () => {
		for (const [tag, options] of Object.entries(OPTIONS)) {
			const meta = storyFor(tag)?.default;
			expect(meta, tag).toBeDefined();
			expect([...meta.argTypes.theme.options].sort(), tag).toEqual([...options].sort());
			expect(meta.args.theme, tag).toBe(options[0]);
		}
		for (const { default: meta } of stories) {
			expect(Object.keys(meta.argTypes ?? {}), meta.title).not.toContain("globalTheme");
		}
	});

	it("renders the primary colour by default without the document stylesheet", () => {
		const callout = mount(`<ycl-callout><ycl-callout-item><p>Text</p></ycl-callout-item></ycl-callout>`);
		const group = shadowOf(callout).querySelector(".callouts");
		expect(getComputedStyle(group).backgroundColor).toBe(rgb("hsl(210, 100%, 21%)"));
	});

	it("takes the page's palette through the shadow root", () => {
		const wrapper = mount(`<div style="--color-theme-secondary: rgb(255, 0, 0)">
			<ycl-callout theme="secondary"><ycl-callout-item><p>Text</p></ycl-callout-item></ycl-callout>
		</div>`);
		const group = shadowOf(wrapper.firstElementChild).querySelector(".callouts");
		expect(getComputedStyle(group).backgroundColor).toBe("rgb(255, 0, 0)");
	});

	it("still ignores tokens redefined by the page", () => {
		const wrapper = mount(`<div style="--color-blue-yale: rgb(255, 0, 0)">
			<ycl-callout><ycl-callout-item><p>Text</p></ycl-callout-item></ycl-callout>
		</div>`);
		const group = shadowOf(wrapper.firstElementChild).querySelector(".callouts");
		expect(getComputedStyle(group).backgroundColor).toBe(rgb("hsl(210, 100%, 21%)"));
	});

	// Gives each palette entry a distinct colour and checks each option paints with its own entry,
	// and the attribute-less default with the default option's.
	describe.each(Object.entries(OPTIONS))("%s", (tag, options) => {
		const sentinels = Object.fromEntries(PALETTE.map((name, i) => [name, `rgb(${201 + i}, ${11 + i}, ${31 + i})`]));
		const palette = PALETTE.map((name) => `--color-theme-${name}: ${sentinels[name]}`).join("; ");

		it.each(options.filter((option) => option !== "default"))("paints the %s option with that palette colour", async (option) => {
			const wrapper = mount(`<div style="${palette}">${render(tag, option)}</div>`);
			await settle();
			const component = wrapper.querySelector(tag);
			expect(component.getAttribute("theme")).toBe(option);
			expect([...paintedColors(component)]).toContain(sentinels[option]);
		});

		if (options[0] !== "default") {
			it(`paints with ${options[0]} when no option is set`, async () => {
				const wrapper = mount(`<div style="${palette}">${render(tag, options[0])}</div>`);
				const component = wrapper.querySelector(tag);
				component.removeAttribute("theme");
				await settle();
				expect([...paintedColors(component)]).toContain(sentinels[options[0]]);
			});
		}
	});
});
