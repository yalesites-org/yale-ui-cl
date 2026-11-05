import { describe, expect, it } from "vitest";
import "./Tabs.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const tabButtons = (tabs) => [...shadowOf(tabs).querySelectorAll('[role="tab"]')];
const panels = (tabs) => [...shadowOf(tabs).querySelectorAll('[role="tabpanel"]')];
const selectedIndex = (tabs) => tabButtons(tabs).findIndex((b) => b.getAttribute("aria-selected") === "true");

const markup = `
	<ycl-tabs label="Sections">
		<ycl-tab label="One">First</ycl-tab>
		<ycl-tab label="Two">Second</ycl-tab>
		<ycl-tab label="Three">Third</ycl-tab>
	</ycl-tabs>`;

describe("ycl-tabs", () => {
	it("builds a tab and panel per child and selects the first", () => {
		const tabs = mount(markup);
		expect(tabButtons(tabs).map((b) => b.textContent)).toEqual(["One", "Two", "Three"]);
		expect(shadowOf(tabs).querySelector('[role="tablist"]').getAttribute("aria-label")).toBe("Sections");
		expect(selectedIndex(tabs)).toBe(0);
		expect(panels(tabs).map((p) => p.hidden)).toEqual([false, true, true]);
		expect(tabs.children[0].selected).toBe(true);
	});

	it("projects each tab into its own panel", () => {
		const tabs = mount(markup);
		expect(panels(tabs).map((p) => p.querySelector("slot").assignedElements()[0])).toEqual([...tabs.children]);
	});

	it("honours an authored selected tab", () => {
		const tabs = mount(markup.replace(`label="Two"`, `label="Two" selected`));
		expect(selectedIndex(tabs)).toBe(1);
	});

	it("selects a tab on click", () => {
		const tabs = mount(markup);
		tabButtons(tabs)[2].click();
		expect(selectedIndex(tabs)).toBe(2);
		expect(tabs.children[2].selected).toBe(true);
		expect(tabs.children[0].selected).toBe(false);
		expect(tabButtons(tabs).map((b) => b.tabIndex)).toEqual([-1, -1, 0]);
	});

	it.each([
		["ArrowRight", 0, 1],
		["ArrowRight", 2, 0],
		["ArrowLeft", 0, 2],
		["Home", 2, 0],
		["End", 0, 2],
	])("%s from tab %i selects tab %i", (key, from, to) => {
		const tabs = mount(markup);
		tabButtons(tabs)[from].click();
		tabButtons(tabs)[from].dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
		expect(selectedIndex(tabs)).toBe(to);
		expect(shadowOf(tabs).activeElement).toBe(tabButtons(tabs)[to]);
	});

	it("follows selected being set on a tab", async () => {
		const tabs = mount(markup);
		tabs.children[1].selected = true;
		await settle();
		expect(selectedIndex(tabs)).toBe(1);
		expect(tabs.children[0].selected).toBe(false);
	});

	it("rebuilds when tabs are added or relabelled", async () => {
		const tabs = mount(markup);
		const tab = document.createElement("ycl-tab");
		tab.label = "Four";
		tabs.append(tab);
		tabs.children[0].label = "Uno";
		await settle();
		expect(tabButtons(tabs).map((b) => b.textContent)).toEqual(["Uno", "Two", "Three", "Four"]);
	});
});
