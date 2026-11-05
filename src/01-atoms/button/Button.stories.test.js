import { describe, it, expect } from "vitest";
import meta, * as stories from "./Button.stories.js";

// ycl-button takes its CTA options (variant, size, animate, radius) as attributes and no longer
// reads `class`, so the stories must build attributes or their controls do nothing.
const namedStories = Object.fromEntries(Object.entries(stories).filter(([name]) => name !== "default"));

// Applies argTypes mappings the way Storybook does before the args reach render.
const mapArgs = (args) =>
	Object.fromEntries(
		Object.entries(args).map(([name, value]) => {
			const mapping = meta.argTypes?.[name]?.mapping;
			return [name, mapping && value in mapping ? mapping[value] : value];
		}),
	);

const parse = (markup) => {
	const template = document.createElement("template");
	template.innerHTML = markup;
	return template.content;
};

const render = (story, args = {}) =>
	parse((story.render ?? meta.render)(mapArgs({ ...meta.args, ...story.args, ...args })));

const button = (story, args) => render(story, args).querySelector("ycl-button");

describe("Button stories", () => {
	it("never sets ycl-button options with class", () => {
		const withClass = Object.entries(namedStories)
			.filter(([, story]) => [...render(story).querySelectorAll("ycl-button")].some((el) => el.hasAttribute("class")))
			.map(([name]) => name);
		expect(withClass).toEqual([]);
	});

	it("renders Default as an outline button", () => {
		expect(button(stories.Default).getAttribute("variant")).toBe("outline");
	});

	it("sets variant=\"filled\" from the Variant control", () => {
		expect(button(stories.Default, { variant: "filled" }).getAttribute("variant")).toBe("filled");
	});

	it("sets radius=\"pill\" from the Radius Type control", () => {
		const el = button(stories.Default, { variant: "filled", radius: "pill" });
		expect(el.getAttribute("variant")).toBe("filled");
		expect(el.getAttribute("radius")).toBe("pill");
	});

	it("sets size and animate from their controls", () => {
		const el = button(stories.Default, { size: "large", animate: "wipe" });
		expect(el.getAttribute("size")).toBe("large");
		expect(el.getAttribute("animate")).toBe("wipe");
	});

	it("adds no animate, radius or size attribute for the defaults", () => {
		const el = button(stories.Default);
		expect(el.hasAttribute("animate")).toBe(false);
		expect(el.hasAttribute("radius")).toBe(false);
		expect(el.hasAttribute("size")).toBe(false);
	});
});
