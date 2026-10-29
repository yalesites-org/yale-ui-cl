import { describe, expect, it } from "vitest";

// Every component's folder tier and its Storybook sidebar tier (the first segment of the
// story title) must agree, so the sidebar mirrors src/.
const TIERS = {
	"00-tokens": "Tokens",
	"01-atoms": "Atoms",
	"02-molecules": "Molecules",
	"03-organisms": "Organisms",
};

const stories = Object.entries(import.meta.glob("./0*-*/**/*.stories.js", { eager: true })).map(([path, module]) => {
	const folder = path.split("/")[1];
	const title = module.default?.title ?? "";
	const segments = title.split("/");
	return { path, folder, title, titleTier: segments[0], name: segments.at(-1) };
});

describe("component tiers", () => {
	it("finds stories", () => {
		expect(stories.length).toBeGreaterThan(0);
	});

	it("gives every stories file a title", () => {
		expect(stories.filter((story) => !story.title).map((story) => story.path)).toEqual([]);
	});

	it("keeps every stories file in a known tier folder", () => {
		expect(stories.filter((story) => !TIERS[story.folder]).map((story) => story.path)).toEqual([]);
	});

	it.each(stories.filter((story) => story.title && TIERS[story.folder]))(
		"$path is titled under its folder's tier",
		({ folder, titleTier }) => {
			expect(titleTier).toBe(TIERS[folder]);
		},
	);

	it.each([
		["Audio Player", "Molecules"],
		["Action Banner", "Organisms"],
		["Image Banner", "Organisms"],
		["Content Spotlight Portrait", "Organisms"],
		["Content Spotlight Landscape", "Organisms"],
		["Tabs", "Organisms"],
		["Link Skip", "Atoms"],
		["Read Time", "Atoms"],
	])("puts %s under %s", (name, tier) => {
		const matches = stories.filter((story) => story.name === name);
		expect(matches).toHaveLength(1);
		const [story] = matches;
		expect(story.titleTier).toBe(tier);
		expect(TIERS[story.folder]).toBe(tier);
	});
});
