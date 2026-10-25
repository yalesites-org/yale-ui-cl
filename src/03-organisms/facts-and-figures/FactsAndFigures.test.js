import { describe, expect, it } from "vitest";
import "./FactsAndFigures.js";
import "../../01-atoms/text-link/Link.js";
// The document-level rules (base.css loads this file into the page) aren't applied in unit tests otherwise.
import "./facts-and-figures.css";
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

	it("defaults to theme one, and treats an unknown theme as theme one", async () => {
		const stat = `<ycl-facts-and-figures-item><span slot="stat">1</span>x</ycl-facts-and-figures-item>`;
		const plain = mount(`<ycl-facts-and-figures>${stat}</ycl-facts-and-figures>`);
		const one = mount(`<ycl-facts-and-figures theme="one">${stat}</ycl-facts-and-figures>`);
		const unknown = mount(`<ycl-facts-and-figures theme="seven">${stat}</ycl-facts-and-figures>`);
		await settle();
		const styleOf = (el) => getComputedStyle(shadowOf(el).querySelector(".facts-and-figures"));
		expect(plain.theme).toBe("one");
		expect(styleOf(plain).backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
		[plain, unknown].forEach((el) => {
			expect(styleOf(el).paddingTop).toBe(styleOf(one).paddingTop);
			expect(styleOf(el).backgroundColor).toBe(styleOf(one).backgroundColor);
			expect(styleOf(el).color).toBe(styleOf(one).color);
		});
	});

	it("reports theme one from the theme property unless the attribute is one to six", () => {
		const themeOf = (attrs) => mount(`<ycl-facts-and-figures ${attrs}></ycl-facts-and-figures>`).theme;
		expect(themeOf("")).toBe("one");
		expect(themeOf('theme="four"')).toBe("four");
		expect(themeOf('theme="seven"')).toBe("one");
		expect(themeOf('theme=""')).toBe("one");
	});

	it("gives each of themes one to six its own background", async () => {
		const themes = ["one", "two", "three", "four", "five", "six"];
		const groups = themes.map((theme) => mount(`<ycl-facts-and-figures theme="${theme}"></ycl-facts-and-figures>`));
		await settle();
		const colours = groups.map((el) => getComputedStyle(shadowOf(el).querySelector(".facts-and-figures")).backgroundColor);
		colours.forEach((colour, i) => expect(colour, themes[i]).not.toBe("rgba(0, 0, 0, 0)"));
		expect(new Set(colours).size).toBe(themes.length);
	});

	it("gives stats inside the group no background of their own, whatever their theme", async () => {
		const group = mount(`
			<ycl-facts-and-figures theme="two">
				<ycl-facts-and-figures-item><span slot="stat">1</span>x</ycl-facts-and-figures-item>
				<ycl-facts-and-figures-item theme="three"><span slot="stat">2</span>y</ycl-facts-and-figures-item>
			</ycl-facts-and-figures>
		`);
		await settle();
		const groupColour = getComputedStyle(shadowOf(group).querySelector(".facts-and-figures")).color;
		group.querySelectorAll("ycl-facts-and-figures-item").forEach((item) => {
			const stat = getComputedStyle(shadowOf(item).querySelector(".facts-and-figures-item"));
			expect(stat.backgroundColor).toBe("rgba(0, 0, 0, 0)");
			expect(stat.color).toBe(groupColour);
		});
	});

	it("drops a stat's horizontal padding inside the group unless it is padded", async () => {
		const group = mount(`
			<ycl-facts-and-figures>
				<ycl-facts-and-figures-item><span slot="stat">1</span>x</ycl-facts-and-figures-item>
				<ycl-facts-and-figures-item padded><span slot="stat">2</span>y</ycl-facts-and-figures-item>
			</ycl-facts-and-figures>
		`);
		await settle();
		const [plain, padded] = [...group.querySelectorAll("ycl-facts-and-figures-item")]
			.map((item) => getComputedStyle(shadowOf(item).querySelector(".facts-and-figures-item__inner")));
		expect(plain.paddingLeft).toBe("0px");
		expect(plain.paddingTop).not.toBe("0px");
		expect(padded.paddingLeft).toBe(padded.paddingTop);
	});

	it("tints a background image with theme one when the theme is unknown", async () => {
		const group = mount(`<ycl-facts-and-figures theme="seven"><img slot="image" src="data:," alt=""></ycl-facts-and-figures>`);
		const themed = mount(`<ycl-facts-and-figures theme="one"><img slot="image" src="data:," alt=""></ycl-facts-and-figures>`);
		await settle();
		const overlay = (el) => getComputedStyle(shadowOf(el).querySelector(".facts-and-figures__image"), "::before").backgroundColor;
		expect(overlay(group)).toBe(overlay(themed));
		expect(overlay(group)).not.toBe("rgba(0, 0, 0, 0)");
	});

	it("stretches the img inside a slotted picture to fill the image wrapper", async () => {
		const group = mount(`
			<ycl-facts-and-figures style="display: block; width: 40rem; min-height: 20rem;">
				<picture slot="image"><img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'/%3E" alt=""></picture>
				<ycl-facts-and-figures-item><span slot="stat">14</span>Residential colleges</ycl-facts-and-figures-item>
			</ycl-facts-and-figures>
		`);
		const img = group.querySelector("picture img");
		await img.decode();
		await settle();
		const box = shadowOf(group).querySelector(".facts-and-figures__image").getBoundingClientRect();
		const picture = group.querySelector("picture").getBoundingClientRect();
		const image = img.getBoundingClientRect();
		expect(box.height).toBeGreaterThan(100);
		expect({ width: picture.width, height: picture.height }).toEqual({ width: box.width, height: box.height });
		expect({ width: image.width, height: image.height }).toEqual({ width: box.width, height: box.height });
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

describe("ycl-facts-and-figures options", () => {
	const stat = (attrs = "") => `<ycl-facts-and-figures-item ${attrs}><span slot="stat">1</span>x</ycl-facts-and-figures-item>`;

	it("copies its alignment, presentation and padded onto every stat, over the stat's own", async () => {
		const group = mount(`
			<ycl-facts-and-figures alignment="left" presentation="plain" padded>
				${stat()}
				${stat('alignment="center" presentation="basic"')}
			</ycl-facts-and-figures>
		`);
		await settle();
		group.querySelectorAll("ycl-facts-and-figures-item").forEach((item) => {
			expect(item.getAttribute("alignment")).toBe("left");
			expect(item.getAttribute("presentation")).toBe("plain");
			expect(item.hasAttribute("padded")).toBe(true);
		});
	});

	it("copies its options onto a stat added later", async () => {
		const group = mount(`<ycl-facts-and-figures alignment="left" presentation="plain" padded></ycl-facts-and-figures>`);
		await settle();
		const item = document.createElement("ycl-facts-and-figures-item");
		group.append(item);
		await settle();
		expect(item.getAttribute("alignment")).toBe("left");
		expect(item.getAttribute("presentation")).toBe("plain");
		expect(item.hasAttribute("padded")).toBe(true);
	});

	it("updates its stats when an option changes, and removes it from them when it's removed", async () => {
		const group = mount(`<ycl-facts-and-figures alignment="left" padded>${stat()}</ycl-facts-and-figures>`);
		await settle();
		const item = group.querySelector("ycl-facts-and-figures-item");
		const before = shadowOf(group).querySelector(".facts-and-figures__items > li");
		group.alignment = "center";
		group.presentation = "plain";
		expect(item.getAttribute("alignment")).toBe("center");
		expect(item.getAttribute("presentation")).toBe("plain");
		group.padded = false;
		group.removeAttribute("alignment");
		expect(item.hasAttribute("padded")).toBe(false);
		expect(item.hasAttribute("alignment")).toBe(false);
		await settle();
		// Setting options on stats doesn't re-render the list.
		expect(shadowOf(group).querySelector(".facts-and-figures__items > li")).toBe(before);
	});

	it("leaves a stat's own options alone when the group doesn't set them", async () => {
		const group = mount(`<ycl-facts-and-figures>${stat('alignment="left" presentation="plain" padded')}</ycl-facts-and-figures>`);
		await settle();
		const item = group.querySelector("ycl-facts-and-figures-item");
		expect(item.getAttribute("alignment")).toBe("left");
		expect(item.getAttribute("presentation")).toBe("plain");
		expect(item.hasAttribute("padded")).toBe(true);
	});

	it("doesn't copy its options onto heading, intro, link or image children", async () => {
		const group = mount(`
			<ycl-facts-and-figures alignment="left" presentation="plain" padded>
				${named.map((name) => `<ycl-facts-and-figures-item slot="${name}"></ycl-facts-and-figures-item>`).join("")}
				${stat()}
			</ycl-facts-and-figures>
		`);
		await settle();
		named.forEach((name) => {
			const child = group.querySelector(`[slot="${name}"]`);
			["alignment", "presentation", "padded"].forEach((attr) => expect(child.hasAttribute(attr), `${name} ${attr}`).toBe(false));
		});
	});

	it("gives a slotted text link the group's text colour, whatever the theme", async () => {
		const themes = ["one", "two", "three", "four", "five", "six"];
		const groups = themes.map((theme) => mount(`
			<ycl-facts-and-figures theme="${theme}">
				<p slot="intro">Some intro text.</p>
				<ycl-text-link slot="link" href="https://example.com/facts">More facts</ycl-text-link>
			</ycl-facts-and-figures>
		`));
		await settle();
		groups.forEach((group, i) => {
			const textColour = getComputedStyle(group.querySelector('[slot="intro"]')).color;
			const anchor = shadowOf(group.querySelector("ycl-text-link")).querySelector("a");
			expect(getComputedStyle(anchor).color, themes[i]).toBe(textColour);
		});
	});
});
