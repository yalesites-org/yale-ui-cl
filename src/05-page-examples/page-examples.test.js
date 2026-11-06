import { describe, expect, it } from "vitest";
import { setProjectAnnotations } from "@storybook/web-components-vite";
import { composeStories } from "storybook/preview-api";
import manifest from "../../custom-elements.json";
import preview from "../../.storybook/preview.js";
import * as module from "./PageExamples.stories.js";
import "../styles/base.css";

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
		attributes: elements.flatMap((el) => [...el.attributes].map((attr) => ({ tag: el.localName, name: attr.name, value: attr.value }))),
	};
	document.body.replaceChildren();
	return result;
});

// The allowed values of each attribute whose declared type is a union of string literals such as
// "primary"|"secondary", by tag and attribute name. Free-text, number and boolean types are left out.
const literalUnion = /^\s*"[^"]*"(\s*\|\s*"[^"]*")*\s*$/;
const allowedValues = new Map(
	manifest.modules
		.flatMap((mod) => mod.declarations ?? [])
		.filter((d) => d.customElement && d.tagName)
		.flatMap((d) => (d.attributes ?? [])
			.filter((attr) => literalUnion.test(attr.type?.text ?? ""))
			.map((attr) => [`${d.tagName} ${attr.name}`, [...attr.type.text.matchAll(/"([^"]*)"/g)].map((m) => m[1])])),
);

const contentTypeWords = /meta|event|post|profile|resource/i;

describe("Page examples", () => {
	it("lives in the Page examples section", () => {
		expect(meta.title.startsWith("Page examples/")).toBe(true);
	});

	it("has at least two examples", () => {
		expect(examples.length).toBeGreaterThanOrEqual(2);
	});

	it.each(examples)("$exportName is a generic page built from UICL components", ({ exportName, name, tags, pageTitles }) => {
		// The story module's static imports have already registered every component by now, so an
		// unregistered hyphenated tag is a stale or misspelled name that renders as an unknown element.
		const notDefined = [...tags].filter((tag) => !customElements.get(tag));
		expect(notDefined).toEqual([]);
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

	it.each(examples)("$exportName only uses attribute values the manifest declares", ({ attributes }) => {
		expect(allowedValues.has("ycl-callout theme")).toBe(true);
		const invalid = attributes
			.filter(({ tag, name, value }) => allowedValues.has(`${tag} ${name}`) && !allowedValues.get(`${tag} ${name}`).includes(value))
			.map(({ tag, name, value }) => `<${tag} ${name}="${value}">`);
		expect(invalid).toEqual([]);
	});

	it("stretches contained sections to the site width inside the flex <main>", async () => {
		document.body.style.width = "1280px";
		document.body.style.margin = "0";
		document.body.innerHTML = composed.DepartmentHomepage();
		await customElements.whenDefined("ycl-heading");
		const main = document.querySelector("main");
		const mainStyle = getComputedStyle(main);
		const available = main.clientWidth - parseFloat(mainStyle.paddingLeft) - parseFloat(mainStyle.paddingRight);
		const wrappers = [...main.children].filter((el) => el.localName === "div" && el.style.marginInline === "auto");
		expect(wrappers.length).toBeGreaterThan(0);
		for (const wrapper of wrappers) {
			const maxWidth = parseFloat(getComputedStyle(wrapper).maxWidth);
			const expected = Number.isNaN(maxWidth) ? available : Math.min(available, maxWidth);
			expect(wrapper.getBoundingClientRect().width).toBeCloseTo(expected, 0);
		}
	});

	it("stretches every grid item's content to the row height on the Department homepage", async () => {
		document.body.style.width = "1280px";
		document.body.style.margin = "0";
		document.body.innerHTML = composed.DepartmentHomepage();
		try {
			await customElements.whenDefined("ycl-custom-card");
			// Make one card's text longer than its row-mates' so the row is taller than the shorter cards,
			// whatever font the browser falls back to.
			document.querySelector("ycl-custom-card p").append(" Extra text that wraps onto more lines than the other cards in this row.".repeat(3));
			const items = [...document.querySelectorAll("main ul[style*=\"display: grid\"] > li")];
			expect(items.length).toBeGreaterThan(0);
			await Promise.all(items.map((li) => li.firstElementChild.updateComplete));
			const mismatched = items
				.map((li) => [li.firstElementChild.localName, li.getBoundingClientRect().height, li.firstElementChild.getBoundingClientRect().height])
				.filter(([, row, child]) => Math.abs(row - child) > 1);
			expect(mismatched).toEqual([]);
		} finally {
			document.body.replaceChildren();
			document.body.removeAttribute("style");
		}
	});

	it("gives the Department homepage quick links band a background image with no size label", () => {
		document.body.innerHTML = composed.DepartmentHomepage();
		const img = document.querySelector("ycl-quick-links [slot=\"image\"] img");
		const svg = decodeURIComponent(img.getAttribute("src"));
		document.body.replaceChildren();
		expect(svg).not.toContain("<text");
		expect(svg).not.toMatch(/\d+ x \d+/);
	});
});
