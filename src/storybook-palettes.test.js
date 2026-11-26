import { afterEach, describe, expect, it } from "vitest";
import tokens from "@yalesites-org/tokens/build/json/tokens.json";
import preview from "../.storybook/preview.js";
import { DEFAULT_PALETTE, PALETTE_PROPERTIES, PALETTES, applyPalette } from "../.storybook/palettes.js";
import "./main.js";
import { mount, rgb, settle, shadowOf } from "../test/helpers.js";

// The YaleSites palettes as the tokens package defines them, in the order editors see them: an
// oracle independent of .storybook/palettes.js.
const tokenPalettes = Object.values(tokens["global-themes"]);
const SLOTS = ["slot-one", "slot-two", "slot-three", "slot-four", "slot-five"];
const colorsOf = (label) => tokenPalettes.find((p) => p.label === label).colors;
const idOf = (label) => PALETTES.find((p) => p.label === label).id;

const root = document.documentElement;
const rootValues = () => PALETTE_PROPERTIES.map((property) => root.style.getPropertyValue(property));

afterEach(() => applyPalette(DEFAULT_PALETTE.id));

describe("Storybook palette switcher", () => {
	it("lists every YaleSites palette in the toolbar, by the name editors see", () => {
		const palette = preview.globalTypes?.palette;
		expect(palette, "globalTypes.palette").toBeDefined();
		expect(palette.toolbar.items.map((item) => item.title)).toEqual(tokenPalettes.map((p) => p.label));
		expect(palette.toolbar.items.map((item) => item.value)).toEqual(PALETTES.map((p) => p.id));
		expect(palette.toolbar.dynamicTitle).toBe(true);
	});

	it("defaults to Old Blues", () => {
		expect(preview.initialGlobals?.palette).toBe(idOf("Old Blues"));
	});

	it("applies the chosen palette through a decorator that re-renders the story", () => {
		const story = () => "rendered";
		const context = { globals: { palette: idOf("Shoreline Summer") } };
		const outputs = (preview.decorators ?? []).map((decorate) => decorate(story, context));
		expect(outputs).toContain("rendered");
		expect(root.style.getPropertyValue("--color-theme-tertiary")).toBe(colorsOf("Shoreline Summer")["slot-three"]);
	});

	it("sets the five palette properties from the palette's first five color slots", () => {
		for (const { label, colors } of tokenPalettes.slice(1)) {
			applyPalette(idOf(label));
			expect(rootValues(), label).toEqual(SLOTS.map((slot) => colors[slot]));
		}
	});

	it.each([
		["Old Blues, so components use their own defaults", DEFAULT_PALETTE.id],
		["an unknown palette id", "not-a-palette"],
	])("leaves the properties unset on %s", (_, id) => {
		applyPalette(idOf("New Haven Green"));
		applyPalette(id);
		expect(rootValues()).toEqual(PALETTE_PROPERTIES.map(() => ""));
	});

	it("repaints a themed component in the chosen palette", async () => {
		const callout = mount(`<ycl-callout theme="secondary"><ycl-callout-item><p>Text</p></ycl-callout-item></ycl-callout>`);
		await settle();
		const group = shadowOf(callout).querySelector(".callouts");
		applyPalette(idOf("New Haven Green"));
		expect(getComputedStyle(group).backgroundColor).toBe(rgb(colorsOf("New Haven Green")["slot-two"]));
	});

	it("explains how to switch palettes in the README", async () => {
		const { default: readme } = await import("../README.md?raw");
		expect(readme).toMatch(/palette switcher/i);
	});
});
