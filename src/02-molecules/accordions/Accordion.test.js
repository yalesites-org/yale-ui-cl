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

	// The label alone tells screen readers what the button does; aria-expanded would contradict it
	// ("Collapse All, expanded"). data-expanded only drives the arrow rotation.
	const expectToggleAll = (accordion, label, allExpanded) => {
		const button = toggleAll(accordion);
		expect(button.textContent.trim()).toBe(label);
		expect(button.hasAttribute("aria-expanded")).toBe(false);
		expect(button.hasAttribute("data-expanded")).toBe(allExpanded);
	};

	it("has one Expand All button that toggles to Collapse All", () => {
		const accordion = mount(markup);
		const items = [...accordion.children];
		expect(shadowOf(accordion).querySelectorAll(".accordion__controls button")).toHaveLength(1);
		expectToggleAll(accordion, "Expand All", false);

		toggleAll(accordion).click();
		expect(items.map((item) => item.expanded)).toEqual([true, true]);
		expectToggleAll(accordion, "Collapse All", true);

		toggleAll(accordion).click();
		expect(items.map((item) => item.expanded)).toEqual([false, false]);
		expectToggleAll(accordion, "Expand All", false);
	});

	it("rotates the toggle-all arrow once every item is open", () => {
		const accordion = mount(markup);
		const icon = shadowOf(accordion).querySelector(".accordion__toggle-all .accordion__icon");
		// Read the end state, never a frame mid-transition, if a transition is ever added.
		icon.style.transition = "none";
		const isFlipped = () => {
			const { a, d } = new DOMMatrix(getComputedStyle(icon).transform);
			return a < -0.99 && d < -0.99;
		};
		const isUnrotated = () => new DOMMatrix(getComputedStyle(icon).transform).isIdentity;

		expect(isUnrotated()).toBe(true);
		toggleAll(accordion).click();
		expect(isFlipped()).toBe(true);
		toggleAll(accordion).click();
		expect(isUnrotated()).toBe(true);
	});

	it("reads Collapse All when every item starts expanded, even before the items upgrade", () => {
		// mount() parses into an inert template and then appends, so the accordion upgrades and
		// connects before its items do, as when the markup is in the page before the module runs.
		const accordion = mount(`
			<ycl-accordion>
				<ycl-accordion-item expanded><span slot="heading">One</span>Body</ycl-accordion-item>
				<ycl-accordion-item expanded><span slot="heading">Two</span>Body</ycl-accordion-item>
			</ycl-accordion>`);
		expectToggleAll(accordion, "Collapse All", true);

		toggleAll(accordion).click();
		expect([...accordion.children].map((item) => item.expanded)).toEqual([false, false]);
		expectToggleAll(accordion, "Expand All", false);
	});

	it("follows items opened and closed one at a time", async () => {
		const accordion = mount(markup);
		const items = [...accordion.children];
		trigger(items[1]).click();
		await settle();
		expectToggleAll(accordion, "Collapse All", true);
		trigger(items[0]).click();
		await settle();
		expectToggleAll(accordion, "Expand All", false);
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
