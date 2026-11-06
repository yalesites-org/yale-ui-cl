import { describe, expect, it } from "vitest";
import { page } from "vitest/browser";
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

	// Where each block's content starts, by story. Each selector may match several elements; every
	// match is an anchor. Shadow roots are closed, so these are light-DOM children, which render at
	// their slotted position. Left out on purpose, as their content doesn't start at the page edge
	// by design: the visually hidden page title on the homepage; the action banner, whose text sits
	// inside its own padded panel; the centred callout; the pull quote and quote callout, which
	// centre a content-width reading column; and the inline message, whose text follows its icon.
	const alignedAnchors = {
		DepartmentHomepage: [
			"ycl-quick-links > ycl-heading[slot=\"heading\"]",
			"main > div > ycl-heading",
			// Image-left: the image starts the block and the text follows it.
			"ycl-text-with-image > ycl-image[slot=\"image\"]",
			"footer p",
		],
		ProgramOverview: [
			"ycl-page-title",
			"ycl-read-time",
			"ycl-text > p",
			"ycl-wrapped-image > p:not([slot])",
			"main > div > ycl-heading",
			"ycl-video > ycl-heading[slot=\"heading\"]",
			"ycl-content-spotlight-portrait > ycl-image[slot=\"image\"]",
			"ycl-wrapped-callout > p:not([slot])",
			"ycl-image-block > ycl-image",
			"ycl-accordion > ycl-heading[slot=\"heading\"]",
			// The link group's column rule; its headings and links are inset from it by design.
			"ycl-link-group",
			"ycl-related-content > ycl-heading[slot=\"heading\"]",
			// The first term group; later ones sit beside it on wide screens.
			"ycl-taxonomy-display-item:first-of-type",
			"footer p",
		],
		DirectoryListing: [
			"ycl-page-title",
			"ycl-text > p",
			"main > div > ycl-heading",
			"ycl-link-grid > ycl-heading[slot=\"heading\"]",
			"footer p",
		],
	};

	const settle = async () => {
		const elements = [...document.body.querySelectorAll("*")];
		await Promise.all([...new Set(elements.map((el) => el.localName).filter((name) => name.includes("-")))].map((tag) => customElements.whenDefined(tag)));
		await Promise.all(elements.filter((el) => el.updateComplete).map((el) => el.updateComplete));
		await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
	};

	// The left edge of an anchor's content. For the page title that's its light-DOM text, measured
	// with any prefix removed: the prefix sits in the closed shadow root at the start of the line.
	const leftEdge = (el) => {
		if (el.localName !== "ycl-page-title") return el.getBoundingClientRect().left;
		const range = document.createRange();
		range.selectNodeContents(el);
		return range.getClientRects()[0].left;
	};

	it.each(Object.keys(alignedAnchors).flatMap((exportName) => [1280, 375].map((width) => ({ exportName, width }))))(
		"$exportName lines up the left edge of every block's content at $width px",
		async ({ exportName, width }) => {
			const { innerWidth, innerHeight } = window;
			await page.viewport(width, 900);
			try {
				const output = composed[exportName]();
				if (typeof output === "string") document.body.innerHTML = output;
				else document.body.replaceChildren(output);
				document.querySelectorAll("ycl-page-title[prefix]").forEach((el) => el.removeAttribute("prefix"));
				await settle();
				const edges = alignedAnchors[exportName].flatMap((selector) => {
					const matches = [...document.querySelectorAll(selector)];
					// A missing anchor is a stale selector, not an aligned page.
					expect(matches.length, selector).toBeGreaterThan(0);
					return matches.map((el, i) => [`${selector} #${i + 1}`, Math.round(leftEdge(el) * 10) / 10]);
				});
				const reference = edges.find(([label]) => label.startsWith("main > div > ycl-heading"))[1];
				const misaligned = edges.filter(([, left]) => Math.abs(left - reference) > 1).map(([label, left]) => `${label} starts at ${left}px, not ${reference}px`);
				expect(misaligned).toEqual([]);
			} finally {
				await page.viewport(innerWidth, innerHeight);
			}
		},
	);

	it("gives the Department homepage quick links band a background image with no size label", () => {
		document.body.innerHTML = composed.DepartmentHomepage();
		const img = document.querySelector("ycl-quick-links [slot=\"image\"] img");
		const svg = decodeURIComponent(img.getAttribute("src"));
		document.body.replaceChildren();
		expect(svg).not.toContain("<text");
		expect(svg).not.toMatch(/\d+ x \d+/);
	});
});
