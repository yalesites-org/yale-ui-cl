import { describe, it, expect } from "vitest";
import meta, * as stories from "./Button.stories.js";

// ycl-button takes its CTA options (variant, animate, radius) as attributes and no longer reads
// `class`, so the stories must build attributes or their controls do nothing.
const namedStories = Object.fromEntries(Object.entries(stories).filter(([name]) => name !== "default"));

const parse = (markup) => {
	const template = document.createElement("template");
	template.innerHTML = markup;
	return template.content;
};

const render = (story) => {
	const args = { ...meta.args, ...story.args };
	return parse((story.render ?? meta.render)(args));
};

const button = (story) => render(story).querySelector("ycl-button");

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

	it("renders Filled with variant=\"filled\"", () => {
		expect(button(stories.Filled).getAttribute("variant")).toBe("filled");
	});

	it("renders Pill filled with radius=\"pill\"", () => {
		const el = button(stories.Pill);
		expect(el.getAttribute("variant")).toBe("filled");
		expect(el.getAttribute("radius")).toBe("pill");
	});

	it("adds no animate attribute for the default fade", () => {
		expect(button(stories.Default).hasAttribute("animate")).toBe(false);
	});
});
