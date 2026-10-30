import { afterEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import "./Breadcrumbs.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const markup = `
	<ycl-breadcrumbs>
		<a href="/">Home</a>
		<a href="/programs">Academic Programs</a>
		<a href="/programs/chemistry">Undergraduate Chemistry</a>
	</ycl-breadcrumbs>`;

const nav = (el) => shadowOf(el).querySelector("nav");
const items = (el) => [...shadowOf(el).querySelectorAll("ol > li")];
const toggle = (el) => shadowOf(el).querySelector(".breadcrumbs__button");
const inner = (el) => shadowOf(el).querySelector(".breadcrumbs__inner");
const parentLabel = (el) => toggle(el).querySelector(".breadcrumbs__parent");
const current = (el) => [...el.children].filter((child) => child.hasAttribute("aria-current"));

describe("ycl-breadcrumbs", () => {
	afterEach(() => page.viewport(414, 896));

	it("is a navigation landmark labelled Breadcrumb", () => {
		const el = mount(markup);
		expect(nav(el).getAttribute("aria-label")).toBe("Breadcrumb");
		expect(nav(el).hidden).toBe(false);
	});

	it("takes its landmark label from the label attribute", () => {
		const el = mount(markup.replace("<ycl-breadcrumbs>", '<ycl-breadcrumbs label="You are here">'));
		expect(nav(el).getAttribute("aria-label")).toBe("You are here");
		el.removeAttribute("label");
		expect(nav(el).getAttribute("aria-label")).toBe("Breadcrumb");
	});

	it("puts each item in its own list item of an ordered list", () => {
		const el = mount(markup);
		expect(shadowOf(el).querySelectorAll("ol")).toHaveLength(1);
		expect(items(el).map((li) => li.querySelector("slot").assignedElements()[0])).toEqual([...el.children]);
	});

	it("marks the last item as the current page", () => {
		const el = mount(markup);
		expect(current(el)).toEqual([el.lastElementChild]);
		expect(el.lastElementChild.getAttribute("aria-current")).toBe("page");
	});

	it("keeps an author-marked current item and marks no other", () => {
		const el = mount(markup.replace('<a href="/programs">', '<a href="/programs" aria-current="page">'));
		expect(current(el)).toEqual([el.children[1]]);
	});

	it("follows an author marking a different item after render", async () => {
		const el = mount(markup);
		el.children[1].setAttribute("aria-current", "page");
		await settle();
		expect(current(el)).toEqual([el.children[1]]);
		el.children[1].removeAttribute("aria-current");
		await settle();
		expect(current(el)).toEqual([el.lastElementChild]);
	});

	it("marks the link inside a text-link item", async () => {
		await import("../../01-atoms/text-link/Link.js");
		const el = mount(`<ycl-breadcrumbs><text-link href="/">Home</text-link><text-link href="/a">A</text-link></ycl-breadcrumbs>`);
		expect(shadowOf(el.lastElementChild).querySelector("a").getAttribute("aria-current")).toBe("page");
		// The list items never carry it; the mark lives on the item and its focusable link.
		expect(items(el).some((li) => li.hasAttribute("aria-current"))).toBe(false);
	});

	it("treats aria-current=false as unmarked", () => {
		const el = mount(markup.replace('<a href="/programs">', '<a href="/programs" aria-current="false">'));
		expect(el.lastElementChild.getAttribute("aria-current")).toBe("page");
	});

	it("marks no current item with no-current", () => {
		const el = mount(markup.replace("<ycl-breadcrumbs>", "<ycl-breadcrumbs no-current>"));
		expect(current(el)).toEqual([]);
	});

	it("is hidden with fewer than two items", () => {
		const el = mount(`<ycl-breadcrumbs><a href="/">Home</a></ycl-breadcrumbs>`);
		expect(nav(el).hidden).toBe(true);
		expect(nav(el).getBoundingClientRect().height).toBe(0);
	});

	it("keeps the separators out of the accessibility tree", () => {
		const el = mount(markup);
		const [first] = items(el);
		expect(first.textContent).not.toContain("|");
		// The alt text after the slash replaces "|" for assistive tech.
		expect(getComputedStyle(first, "::after").content).toBe('"|" / ""');
		expect(getComputedStyle(items(el).at(-1), "::after").content).toBe("none");
	});

	it("collapses a long trail behind a toggle on narrow screens", async () => {
		await page.viewport(414, 896);
		const el = mount(markup);
		const button = toggle(el);
		expect(button.getAttribute("aria-expanded")).toBe("false");
		expect(shadowOf(el).getElementById(button.getAttribute("aria-controls"))).toBe(inner(el));
		expect(button.textContent).toMatch(/Academic Programs, show all breadcrumbs/);
		// The visible parent title is part of the accessible name (WCAG 2.5.3 Label in Name).
		expect(parentLabel(el).textContent).toBe("Academic Programs");
		expect(parentLabel(el).closest("[aria-hidden]")).toBe(null);
		expect(getComputedStyle(button).display).not.toBe("none");
		expect(getComputedStyle(inner(el)).display).toBe("none");

		button.click();
		expect(button.getAttribute("aria-expanded")).toBe("true");
		expect(getComputedStyle(button).display).toBe("none");
		expect(getComputedStyle(inner(el)).display).not.toBe("none");
	});

	it("moves focus to the parent crumb when the toggle hides itself", async () => {
		await page.viewport(414, 896);
		const el = mount(markup);
		toggle(el).focus();
		toggle(el).click();
		expect(document.activeElement).toBe(el.children[1]);
	});

	it("shows the whole trail on wide screens", async () => {
		await page.viewport(1280, 800);
		const el = mount(markup);
		expect(getComputedStyle(toggle(el)).display).toBe("none");
		expect(getComputedStyle(inner(el)).display).not.toBe("none");
	});

	it("doesn't collapse two items or a wrapped trail", async () => {
		await page.viewport(414, 896);
		const two = mount(`<ycl-breadcrumbs><a href="/">Home</a><a href="/a">A</a></ycl-breadcrumbs>`);
		const wrapped = mount(markup.replace("<ycl-breadcrumbs>", "<ycl-breadcrumbs wrap>"));
		for (const el of [two, wrapped]) {
			expect(getComputedStyle(toggle(el)).display).toBe("none");
			expect(getComputedStyle(inner(el)).display).not.toBe("none");
		}
		expect(getComputedStyle(shadowOf(wrapped).querySelector("ol")).flexWrap).toBe("wrap");
	});

	it("re-renders when items change", async () => {
		const el = mount(markup);
		const link = document.createElement("a");
		link.href = "/programs/chemistry/news";
		link.textContent = "News";
		el.append(link);
		await settle();
		expect(items(el)).toHaveLength(4);
		expect(current(el)).toEqual([link]);
		expect(parentLabel(el).textContent).toBe("Undergraduate Chemistry");

		el.replaceChildren(link);
		await settle();
		expect(nav(el).hidden).toBe(true);
	});
});
