import { describe, expect, it } from "vitest";
import "./Accordion.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const trigger = (item) => shadowOf(item).querySelector(".accordion-item__toggle");

describe("ycl-accordion", () => {
	const markup = `
		<ycl-accordion>
			<ycl-accordion-item expanded><span slot="heading">One</span>Body</ycl-accordion-item>
			<ycl-accordion-item><span slot="heading">Two</span>Body</ycl-accordion-item>
		</ycl-accordion>`;

	it("mirrors expanded onto aria-expanded", () => {
		const [first, second] = mount(markup).children;
		expect(trigger(first).getAttribute("aria-expanded")).toBe("true");
		expect(trigger(second).getAttribute("aria-expanded")).toBe("false");
	});

	it("toggles an item when its trigger is clicked", () => {
		const item = mount(markup).children[1];
		trigger(item).click();
		expect(item.expanded).toBe(true);
		expect(trigger(item).getAttribute("aria-expanded")).toBe("true");
		trigger(item).click();
		expect(item.expanded).toBe(false);
	});

	const toggleAll = (accordion) => shadowOf(accordion).querySelector(".accordion__toggle-all");

	it("has one Expand All button that toggles to Collapse All", () => {
		const accordion = mount(markup);
		const items = [...accordion.children];
		expect(shadowOf(accordion).querySelectorAll(".accordion__controls button")).toHaveLength(1);
		expect(toggleAll(accordion).textContent.trim()).toBe("Expand All");
		expect(toggleAll(accordion).getAttribute("aria-expanded")).toBe("false");

		toggleAll(accordion).click();
		expect(items.map((item) => item.expanded)).toEqual([true, true]);
		expect(toggleAll(accordion).textContent.trim()).toBe("Collapse All");
		expect(toggleAll(accordion).getAttribute("aria-expanded")).toBe("true");

		toggleAll(accordion).click();
		expect(items.map((item) => item.expanded)).toEqual([false, false]);
		expect(toggleAll(accordion).textContent.trim()).toBe("Expand All");
	});

	it("reads Collapse All when every item starts expanded, even before the items upgrade", () => {
		// mount() parses into an inert template and then appends, so the accordion upgrades and
		// connects before its items do, as when the markup is in the page before the module runs.
		const accordion = mount(`
			<ycl-accordion>
				<ycl-accordion-item expanded><span slot="heading">One</span>Body</ycl-accordion-item>
				<ycl-accordion-item expanded><span slot="heading">Two</span>Body</ycl-accordion-item>
			</ycl-accordion>`);
		expect(toggleAll(accordion).textContent.trim()).toBe("Collapse All");
		expect(toggleAll(accordion).getAttribute("aria-expanded")).toBe("true");

		toggleAll(accordion).click();
		expect([...accordion.children].map((item) => item.expanded)).toEqual([false, false]);
	});

	it("follows items opened and closed one at a time", async () => {
		const accordion = mount(markup);
		const items = [...accordion.children];
		trigger(items[1]).click();
		await settle();
		expect(toggleAll(accordion).textContent.trim()).toBe("Collapse All");
		trigger(items[0]).click();
		await settle();
		expect(toggleAll(accordion).textContent.trim()).toBe("Expand All");
	});

	it("hides the controls when there's only one item", async () => {
		const accordion = mount(`<ycl-accordion><ycl-accordion-item><span slot="heading">One</span>Body</ycl-accordion-item></ycl-accordion>`);
		await settle();
		expect(shadowOf(accordion).querySelector(".accordion__controls").hidden).toBe(true);
	});

	it("reflects width and alignment, defaulting to content and center", () => {
		const accordion = mount(markup);
		const root = shadowOf(accordion).querySelector(".accordion");
		expect(root.dataset.componentWidth).toBe("content");
		expect(root.dataset.componentAlignment).toBe("center");
		accordion.setAttribute("width", "site");
		accordion.setAttribute("alignment", "left");
		expect(root.dataset.componentWidth).toBe("site");
		expect(root.dataset.componentAlignment).toBe("left");
	});
});
