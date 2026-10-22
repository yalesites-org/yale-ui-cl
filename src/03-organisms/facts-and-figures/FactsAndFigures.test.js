import { describe, expect, it } from "vitest";
import "./FactsAndFigures.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const named = ["heading", "intro", "link", "image"];
const wrapper = (element, name) => shadowOf(element).querySelector(`slot[name="${name}"]`).parentElement;

describe("ycl-facts-and-figures", () => {
	it("registers ycl-facts-and-figures-item along with itself", () => {
		expect(customElements.get("ycl-facts-and-figures")).toBeTruthy();
		expect(customElements.get("ycl-facts-and-figures-item")).toBeTruthy();
	});

	it("renders the heading, intro, link and image slots", async () => {
		const group = mount(`
			<ycl-facts-and-figures>
				<h2 slot="heading">By the numbers</h2>
				<p slot="intro">Some intro text.</p>
				<a slot="link" href="/facts">More facts</a>
				<img slot="image" src="data:," alt="">
				<ycl-facts-and-figures-item><span slot="stat">14</span>Residential colleges</ycl-facts-and-figures-item>
			</ycl-facts-and-figures>
		`);
		await settle();
		named.forEach((name) => {
			expect(wrapper(group, name).hidden, name).toBe(false);
			expect(wrapper(group, name).querySelector("slot").assignedElements(), name).toEqual([group.querySelector(`[slot="${name}"]`)]);
		});
	});

	it("hides the wrappers of empty slots", async () => {
		const group = mount(`
			<ycl-facts-and-figures>
				<ycl-facts-and-figures-item><span slot="stat">14</span>Residential colleges</ycl-facts-and-figures-item>
			</ycl-facts-and-figures>
		`);
		await settle();
		named.forEach((name) => expect(wrapper(group, name).hidden, name).toBe(true));
	});

	it("shows a wrapper once its slot is filled", async () => {
		const group = mount(`<ycl-facts-and-figures></ycl-facts-and-figures>`);
		await settle();
		const heading = document.createElement("h2");
		heading.slot = "heading";
		heading.textContent = "By the numbers";
		group.append(heading);
		await settle();
		expect(wrapper(group, "heading").hidden).toBe(false);
	});

	it("exposes its items as a list, one list item per stat", async () => {
		const group = mount(`
			<ycl-facts-and-figures>
				<h2 slot="heading">By the numbers</h2>
				<ycl-facts-and-figures-item><span slot="stat">14</span>Residential colleges</ycl-facts-and-figures-item>
				<ycl-facts-and-figures-item><span slot="stat">6:1</span>Student to faculty ratio</ycl-facts-and-figures-item>
			</ycl-facts-and-figures>
		`);
		await settle();
		const items = [...shadowOf(group).querySelector("ul").children];
		expect(items.map((item) => item.localName)).toEqual(["li", "li"]);
		expect(items.map((item) => item.querySelector("slot").assignedElements())).toEqual(
			[...group.querySelectorAll("ycl-facts-and-figures-item")].map((item) => [item]),
		);
	});
});

describe("ycl-facts-and-figures-item", () => {
	it("is defined and renders the stat", () => {
		const item = mount(`<ycl-facts-and-figures-item><span slot="stat">$52,000</span>Annual grant</ycl-facts-and-figures-item>`);
		expect(item.constructor.name).toBe("FactsAndFiguresItem");
		const stat = shadowOf(item).querySelector('slot[name="stat"]');
		expect(stat.assignedElements()).toEqual([item.querySelector('[slot="stat"]')]);
		expect(stat.parentElement.hidden).toBe(false);
	});

	it("keeps the eyebrow rule inside the card padding", () => {
		const item = mount(`<ycl-facts-and-figures-item theme="one" style="width: 20rem;"><span slot="stat">14</span>Colleges</ycl-facts-and-figures-item>`);
		const stat = shadowOf(item).querySelector('slot[name="stat"]').parentElement;
		const rule = parseFloat(getComputedStyle(stat, "::before").width);
		expect(rule).toBeGreaterThan(0);
		expect(rule).toBeLessThan(item.getBoundingClientRect().width);
	});
});

describe("ycl-facts-and-figures children and themes", () => {
	it("lists only ycl-facts-and-figures-item children as stats", async () => {
		const group = mount(`
			<ycl-facts-and-figures>
				<h2 slot="Heading">Misspelled slot</h2>
				<ycl-facts-and-figures-item><span slot="stat">14</span>Colleges</ycl-facts-and-figures-item>
				<template><p>Inert</p></template>
			</ycl-facts-and-figures>
		`);
		await settle();
		const slots = [...shadowOf(group).querySelectorAll(".facts-and-figures__items > li slot")];
		expect(slots.map((slot) => slot.assignedElements())).toEqual([[group.querySelector("ycl-facts-and-figures-item")]]);
	});

	it("treats an unknown theme like no theme", async () => {
		const plain = mount(`<ycl-facts-and-figures><ycl-facts-and-figures-item><span slot="stat">1</span>x</ycl-facts-and-figures-item></ycl-facts-and-figures>`);
		const unknown = mount(`<ycl-facts-and-figures theme="four"><ycl-facts-and-figures-item><span slot="stat">1</span>x</ycl-facts-and-figures-item></ycl-facts-and-figures>`);
		await settle();
		const styleOf = (el) => getComputedStyle(shadowOf(el).querySelector(".facts-and-figures"));
		expect(styleOf(unknown).paddingTop).toBe(styleOf(plain).paddingTop);
		expect(styleOf(unknown).backgroundColor).toBe(styleOf(plain).backgroundColor);
	});

	it("tints a background image with theme one when the theme is unknown", async () => {
		const group = mount(`<ycl-facts-and-figures theme="four"><img slot="image" src="data:," alt=""></ycl-facts-and-figures>`);
		const themed = mount(`<ycl-facts-and-figures theme="one"><img slot="image" src="data:," alt=""></ycl-facts-and-figures>`);
		await settle();
		const overlay = (el) => getComputedStyle(shadowOf(el).querySelector(".facts-and-figures__image"), "::before").backgroundColor;
		expect(overlay(group)).toBe(overlay(themed));
		expect(overlay(group)).not.toBe("rgba(0, 0, 0, 0)");
	});
});

describe("ycl-facts-and-figures re-rendering", () => {
	it("keeps its list items when content inside a stat changes", async () => {
		const group = mount(`<ycl-facts-and-figures><ycl-facts-and-figures-item><span slot="stat">1</span>x</ycl-facts-and-figures-item></ycl-facts-and-figures>`);
		await settle();
		const before = shadowOf(group).querySelector(".facts-and-figures__items > li");
		group.querySelector("ycl-facts-and-figures-item").append(document.createElement("span"));
		await settle();
		expect(shadowOf(group).querySelector(".facts-and-figures__items > li")).toBe(before);
	});
});
