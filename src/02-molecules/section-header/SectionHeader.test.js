import { describe, expect, it } from "vitest";
import "./SectionHeader.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const part = (element, selector) => shadowOf(element).querySelector(selector);
const heading = (element) => part(element, "ycl-heading");
const link = (element) => part(element, "ycl-text-link");

describe("ycl-section-header", () => {
	it("shows a heading, intro text and link when all are given", async () => {
		const element = mount(`<ycl-section-header link-href="/all">Events<span slot="text">Upcoming</span><span slot="link">View all</span></ycl-section-header>`);
		await settle();
		expect(heading(element).hidden).toBe(false);
		expect(part(element, ".section-header__text").hidden).toBe(false);
		expect(link(element).hidden).toBe(false);
		expect(link(element).getAttribute("href")).toBe("/all");
	});

	it("hides the heading, intro and link when none are given", async () => {
		const element = mount(`<ycl-section-header></ycl-section-header>`);
		await settle();
		expect(heading(element).hidden).toBe(true);
		expect(part(element, ".section-header__text").hidden).toBe(true);
		expect(link(element).hidden).toBe(true);
	});

	it("hides the top row when it has neither heading nor link, so intro-only headers start flush", async () => {
		const element = mount(`<ycl-section-header><span slot="text">Intro</span></ycl-section-header>`);
		await settle();
		const top = part(element, ".section-header__top");
		expect(top.hidden).toBe(true);
		element.append(Object.assign(document.createElement("span"), { textContent: "Events" }));
		await settle();
		expect(top.hidden).toBe(false);
	});

	it("hides the link without an href, even when it has text", async () => {
		const element = mount(`<ycl-section-header>Events<span slot="link">View all</span></ycl-section-header>`);
		await settle();
		expect(link(element).hidden).toBe(true);
		element.setAttribute("link-href", "/all");
		expect(link(element).hidden).toBe(false);
		element.removeAttribute("link-href");
		expect(link(element).hidden).toBe(true);
	});

	it("sets the heading level by attribute, defaulting to 2", () => {
		const element = mount(`<ycl-section-header>Events</ycl-section-header>`);
		expect(heading(element).getAttribute("level")).toBe("2");
		element.setAttribute("level", "3");
		expect(heading(element).getAttribute("level")).toBe("3");
		element.removeAttribute("level");
		expect(heading(element).getAttribute("level")).toBe("2");
	});

	it("shows content that is added later", async () => {
		const element = mount(`<ycl-section-header></ycl-section-header>`);
		await settle();
		element.append("Events");
		await settle();
		expect(heading(element).hidden).toBe(false);
	});
});
