import { describe, expect, it } from "vitest";
import "./styles/base.css";
import "./main.js";
import { composedElements, mount, settle } from "../test/helpers.js";

// WCAG 2.1 AA text and link-state contrast for every themed component in each of its colour
// options, with the default palette and the document stylesheet loaded, as a page would have it.
const THEMED = [
	"ycl-accordion",
	"ycl-action-banner",
	"ycl-callout",
	"ycl-content-spotlight-portrait",
	"ycl-custom-card",
	"ycl-facts-and-figures",
	"ycl-image-banner",
	"ycl-inline-message",
	"ycl-link-grid",
	"ycl-pull-quote",
	"ycl-quick-links",
	"ycl-quote-callout",
	"ycl-reference-card",
	"ycl-tabs",
	"ycl-taxonomy-display",
	"ycl-text-copy-button",
	"ycl-text-with-image",
	"ycl-tile-item",
	"ycl-wrapped-callout",
];

const stories = Object.values(import.meta.glob("./0*/**/*.stories.js", { eager: true }));
const storyFor = (tag) => stories.find((module) => module.default.component === tag);

const roots = Element.prototype.attachShadow.roots;

// The parent in the flattened tree: the slot a node is assigned to, else its parent, else the
// host of the shadow root it sits in. assignedSlot is null for slots in closed shadow roots, so
// the slot is looked up through the recorded roots.
function composedParent(el) {
	const hostRoot = el.parentElement && roots.get(el.parentElement);
	const slot = hostRoot && [...hostRoot.querySelectorAll("slot")].find((s) => s.assignedElements().includes(el));
	if (slot) return slot;
	if (el.parentElement) return el.parentElement;
	const root = el.parentNode;
	return root instanceof ShadowRoot ? root.host : null;
}

function parse(color) {
	const m = color.match(/rgba?\(([\d.]+),? ([\d.]+),? ([\d.]+)(?:,? \/?\s*([\d.]+))?\)/);
	if (!m) throw new Error(`Unparsed colour ${color}`);
	return { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] };
}

const over = (top, bottom) => ({
	r: top.r * top.a + bottom.r * (1 - top.a),
	g: top.g * top.a + bottom.g * (1 - top.a),
	b: top.b * top.a + bottom.b * (1 - top.a),
	a: 1,
});

function luminance({ r, g, b }) {
	const [R, G, B] = [r, g, b].map((v) => {
		const c = v / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function contrast(a, b) {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

// The opaque colour behind an element: its own and its ancestors' backgrounds composited over
// the page's white. Returns null when an image sits behind it.
function backdrop(el) {
	const layers = [];
	for (let node = el; node; node = composedParent(node)) {
		const style = getComputedStyle(node);
		if (style.backgroundImage !== "none") return null;
		const color = parse(style.backgroundColor);
		if (color.a > 0) layers.push(color);
		if (color.a === 1) break;
	}
	return layers.reduceRight((below, layer) => over(layer, below), { r: 255, g: 255, b: 255, a: 1 });
}

// The element whose style a text node renders with: a light-DOM text node directly inside a
// shadow host takes its style from the slot it's assigned to.
function styleSource(text) {
	const parent = text.parentElement;
	const shadow = roots.get(parent);
	if (!shadow) return parent;
	return [...shadow.querySelectorAll("slot")].find((slot) => slot.assignedNodes().includes(text)) ?? null;
}

// Text that paints, with its contrast against what's behind it.
function measure(component) {
	const results = [];
	for (const el of composedElements(component)) {
		for (const text of el.childNodes) {
			if (text.nodeType !== Node.TEXT_NODE || !text.textContent.trim()) continue;
			const source = styleSource(text);
			if (!source) continue;
			const range = document.createRange();
			range.selectNodeContents(text);
			const rect = range.getBoundingClientRect();
			// Unrendered, hidden, or clipped to a 1px box for screen readers only.
			if (rect.width <= 1 || rect.height <= 1 || getComputedStyle(source).visibility !== "visible") continue;
			if (!el.checkVisibility({ opacityProperty: true }) || el.getBoundingClientRect().width <= 1) continue;
			const bg = backdrop(source);
			if (!bg) continue;
			const fg = over(parse(getComputedStyle(source).color), bg);
			results.push({ el: source, ratio: contrast(fg, bg), text: text.textContent.trim().slice(0, 30) });
		}
	}
	return results;
}

const describeEl = (el) => `<${el.localName}${el.className ? ` class="${el.className}"` : ""}>`;

describe.each(THEMED)("%s contrast", (tag) => {
	const meta = storyFor(tag).default;
	const options = meta.argTypes?.theme?.options ?? [undefined];

	it.each(options)("meets 4.5:1 for text and links with the %s option", async (option) => {
		// Images would hide the backgrounds being measured; the image banner keeps its text on a
		// coloured panel, which is what's measured.
		const args = { ...meta.args, ...(option && { theme: option }), overlay: false };
		const wrapper = mount(`<div>${meta.render(args)}</div>`);
		await settle();
		for (const animation of document.getAnimations()) animation.finish();
		const component = wrapper.querySelector(tag);
		const results = measure(component);
		expect(results.length, "measured text").toBeGreaterThan(0);
		const failures = results
			.filter(({ ratio }) => ratio < 4.5)
			.map(({ el, ratio, text }) => `${describeEl(el)} "${text}" ${ratio.toFixed(2)}:1`);
		expect(failures).toEqual([]);
	});
});

// Hover and visited colours. Browsers hide :visited from getComputedStyle and a test can't hover
// into a closed shadow root, so each state's colour is resolved from the custom properties the
// component's CSS paints that state with, in the control's own scope.
const LINK = {
	hover: "var(--color-link-hover)",
	visited: "var(--color-link-visited-base)",
	"visited hover": "var(--color-link-visited-hover)",
};

// Controls whose states don't follow LINK, by component: [selector, states]. A state is a colour,
// or { color, background } when it also changes the control's background. text-link's inner
// .link always follows LINK (link.css); any other link does unless listed here.
const CONTROLS = {
	"ycl-accordion": [
		[".accordion-item__toggle", { hover: "var(--accordion-item-hover-color, var(--color-link-base))" }],
		[".accordion__toggle-all", { hover: "var(--color-link-base)" }],
	],
	// a:visited comes after a:hover with the same specificity, so it also paints visited hover.
	"ycl-callout": [["a", { hover: "var(--color-text)", visited: LINK.visited, "visited hover": LINK.visited }]],
	"ycl-custom-card": [[".custom-card__heading-link", { ...LINK, hover: "var(--color-theme-secondary, var(--color-blue-medium))" }]],
	"ycl-quick-links": [["a", { hover: { color: "var(--color-action-secondary)", background: "var(--color-action)" } }]],
	"ycl-quote-callout": [["a", { ...LINK, hover: "var(--color-quote-callout-accent)" }]],
	"ycl-reference-card": [
		[".reference-card__heading-link", { ...LINK, hover: "var(--color-theme-secondary, var(--color-blue-medium))" }],
	],
	"ycl-tabs": [[".tabs__link, .tabs__control", { hover: "var(--color-link-base)" }]],
	"ycl-text-copy-button": [[".text-copy-button__button", { hover: "var(--color-link-hover)" }]],
	// Hover underlines the link without changing its colour.
	"ycl-tile-item": [[".tile__item__link", { visited: LINK.visited, "visited hover": LINK["visited hover"] }]],
	// Links only get a base colour, which :visited and :hover keep.
	"ycl-wrapped-callout": [["a", {}]],
};

function statesFor(tag, el) {
	// cta-link's .cta is a button-styled action, not a text link.
	if (el.matches(".cta")) return null;
	if (el.matches(".link")) return LINK;
	const control = CONTROLS[tag]?.find(([selector]) => el.matches(selector));
	if (control) return control[1];
	return el.matches("a[href]:not(.cta)") ? LINK : null;
}

// The colour a CSS colour expression resolves to in an element's scope: inherited custom
// properties and currentcolor resolve as they would on the element's own children.
function resolve(el, property, expression) {
	const probe = document.createElement("span");
	probe.style.setProperty(property, expression);
	el.append(probe);
	const value = getComputedStyle(probe)[property === "color" ? "color" : "backgroundColor"];
	probe.remove();
	return parse(value);
}

function measureStates(tag, component) {
	const results = [];
	for (const el of composedElements(component)) {
		const states = statesFor(tag, el);
		if (!states) continue;
		const style = getComputedStyle(el);
		if (style.visibility !== "visible" || !el.checkVisibility({ opacityProperty: true })) continue;
		const rect = el.getBoundingClientRect();
		if (rect.width <= 1 || rect.height <= 1) continue;
		// Links draw their underline as a background image, so the backdrop is measured from the
		// parent, with the control's own background colour on top.
		const parent = backdrop(composedParent(el));
		if (!parent) continue;
		const behind = over(parse(style.backgroundColor), parent);
		for (const [state, paint] of Object.entries(states)) {
			const { color, background } = typeof paint === "string" ? { color: paint } : paint;
			const bg = background ? over(resolve(el, "background-color", background), behind) : behind;
			const fg = over(resolve(el, "color", color), bg);
			results.push({ el, state, ratio: contrast(fg, bg), fg, bg });
		}
	}
	return results;
}

// Components whose CSS styles plain links nested in their slotted content.
const PLAIN_LINKS = new Set([
	"ycl-callout",
	"ycl-content-spotlight-portrait",
	"ycl-inline-message",
	"ycl-quote-callout",
	"ycl-text-with-image",
	"ycl-wrapped-callout",
]);

// Most stories have no inline links, so a text-link (and a plain link where the component styles
// those) is added to the first paragraph of slotted content outside the action slots. Quick
// links' story slots only cta-links, so it also gets a plain link, which it styles itself.
function addLinks(tag, component) {
	if (tag === "ycl-quick-links") component.insertAdjacentHTML("beforeend", `<a href="#plain">Plain link</a>`);
	const paragraph = [...component.querySelectorAll("p")].find((p) => !p.closest("[slot='ctas'], [slot='actions']"));
	if (!paragraph) return;
	paragraph.insertAdjacentHTML("beforeend", ` <text-link href="#text-link">Text link</text-link>`);
	if (PLAIN_LINKS.has(tag)) paragraph.insertAdjacentHTML("beforeend", ` <a href="#plain">Plain link</a>`);
}

const rgb = ({ r, g, b }) => `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

describe.each(THEMED)("%s link state contrast", (tag) => {
	const meta = storyFor(tag).default;
	const options = meta.argTypes?.theme?.options ?? [undefined];

	it.each(options)("meets 4.5:1 for hover and visited links with the %s option", async (option) => {
		const args = { ...meta.args, ...(option && { theme: option }), overlay: false };
		const wrapper = mount(`<div>${meta.render(args)}</div>`);
		const component = wrapper.querySelector(tag);
		addLinks(tag, component);
		await settle();
		for (const animation of document.getAnimations()) animation.finish();
		const results = measureStates(tag, component);
		const failures = results
			.filter(({ ratio }) => ratio < 4.5)
			.map(({ el, state, ratio, fg, bg }) => `${describeEl(el)} ${state} ${rgb(fg)} on ${rgb(bg)} ${ratio.toFixed(2)}:1`);
		expect(failures).toEqual([]);
	});
});
