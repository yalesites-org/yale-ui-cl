import { describe, expect, it } from "vitest";
import { setProjectAnnotations } from "@storybook/web-components-vite";
import { composeStories } from "storybook/preview-api";
import preview from "../../.storybook/preview.js";
import * as module from "./PageExamples.stories.js";

const meta = module.default;
const composed = composeStories(module, setProjectAnnotations(preview));

// Render each story once, as Storybook would (with preview.js applied), and keep only plain data.
const examples = Object.entries(composed).map(([exportName, Story]) => {
	const output = Story();
	if (typeof output === "string") document.body.innerHTML = output;
	else document.body.replaceChildren(output);
	const elements = [...document.body.querySelectorAll("*")];
	// A story may return a plain wrapper node (e.g. for event listeners); its children are the page.
	const root = typeof output === "string" ? document.body : output;
	const result = {
		exportName,
		name: module[exportName].name ?? "",
		tags: new Set(elements.map((el) => el.localName).filter((name) => name.includes("-"))),
		pageTitles: elements.filter((el) => el.localName === "ycl-page-title").length,
		topLevel: [...root.children].map((el) => el.localName),
		headers: elements.filter((el) => el.localName === "header").length,
	};
	document.body.replaceChildren();
	return result;
});

const contentTypeWords = /meta|event|post|profile|resource/i;

describe("Page examples", () => {
	it("lives in the Page examples section", () => {
		expect(meta.title.startsWith("Page examples/")).toBe(true);
	});

	it("has at least two examples", () => {
		expect(examples.length).toBeGreaterThanOrEqual(2);
	});

	it.each(examples)("$exportName is a generic page built from UICL components", ({ exportName, name, tags, pageTitles }) => {
		expect(tags.size).toBeGreaterThanOrEqual(8);
		expect(exportName).not.toMatch(contentTypeWords);
		expect(name).not.toMatch(contentTypeWords);
		for (const tag of tags) expect(tag).not.toMatch(contentTypeWords);
		expect(pageTitles).toBe(1);
	});

	it.each(examples)("$exportName keeps all top-level content inside landmarks", ({ topLevel, headers }) => {
		const outside = topLevel.filter((name) => name !== "ycl-link-skip" && !["header", "main", "footer"].includes(name));
		expect(outside).toEqual([]);
		expect(headers).toBeLessThanOrEqual(1);
	});
});
