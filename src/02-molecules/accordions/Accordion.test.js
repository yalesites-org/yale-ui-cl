import { describe, expect, it } from "vitest";
import "./Accordion.js";
import { mount, shadowOf } from "../../../test/helpers.js";

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

	it("expands and collapses all items", () => {
		const accordion = mount(markup);
		const items = [...accordion.children];
		shadowOf(accordion).querySelector(".accordion__expand-all").click();
		expect(items.map((item) => item.expanded)).toEqual([true, true]);
		shadowOf(accordion).querySelector(".accordion__collapse-all").click();
		expect(items.map((item) => item.expanded)).toEqual([false, false]);
	});
});
