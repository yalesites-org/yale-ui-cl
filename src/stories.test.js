import { describe, expect, it } from "vitest";

// Every story file's default export records its YaleSites match (see .storybook/yalesites.js).
const stories = Object.entries(import.meta.glob("./**/*.stories.js", { eager: true }));

describe.each(stories)("%s", (_, module) => {
	const meta = module.default;

	it("records its YaleSites match", () => {
		const yalesites = meta.parameters?.yalesites;
		expect(yalesites).toBeTruthy();
		if (yalesites.none) {
			expect(yalesites).toEqual({ none: true });
		} else {
			expect(typeof yalesites.name).toBe("string");
			expect(yalesites.name.trim()).not.toBe("");
			expect(yalesites.story).toMatch(/^[a-z0-9-]+--[a-z0-9-]+$/);
		}
	});
});

// Drupal vocabulary that should stay out of component names (YaleSites matches go in parameters.yalesites).
const DRUPAL_TERMS = /\b(taxonomy|vocabulary|paragraphs?|nodes?|entity|block[ -]?content)\b/i;

it("no story title or component tag uses Drupal terms", () => {
	const offenders = stories
		.flatMap(([, module]) => [module.default.title, module.default.component])
		.filter((name) => name && DRUPAL_TERMS.test(name));
	expect(offenders).toEqual([]);
});
