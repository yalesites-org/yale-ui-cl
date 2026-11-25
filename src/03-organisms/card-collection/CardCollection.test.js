import { describe, expect, it } from "vitest";
import "./CardCollection.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const part = (element, selector) => shadowOf(element).querySelector(selector);
const header = (element) => part(element, "ycl-section-header");
const cards = (element) => part(element, ".card-collection__cards");
const columnCount = (element) => getComputedStyle(cards(element)).gridTemplateColumns.split(" ").length;

const contentCards = `
	<ycl-content-card href="/one"><span slot="heading">One</span></ycl-content-card>
	<ycl-content-card href="/two"><span slot="heading">Two</span></ycl-content-card>
	<ycl-content-card href="/three"><span slot="heading">Three</span></ycl-content-card>
`;

describe("ycl-card-collection", () => {
	it("passes the heading, intro and view-all link to a section header", async () => {
		const element = mount(`<ycl-card-collection level="3" link-href="/news">
			<span slot="heading">News</span>
			<span slot="text">Latest stories</span>
			<span slot="link">View all</span>
			${contentCards}
		</ycl-card-collection>`);
		await settle();
		const sectionHeader = header(element);
		expect(sectionHeader.hidden).toBe(false);
		expect(sectionHeader.getAttribute("level")).toBe("3");
		expect(sectionHeader.getAttribute("link-href")).toBe("/news");
		const headerShadow = shadowOf(sectionHeader);
		expect(headerShadow.querySelector("ycl-heading").hidden).toBe(false);
		expect(headerShadow.querySelector(".section-header__text").hidden).toBe(false);
		expect(headerShadow.querySelector("ycl-text-link").hidden).toBe(false);
	});

	it("hides the section header when there is no heading, intro or link", async () => {
		const element = mount(`<ycl-card-collection>${contentCards}</ycl-card-collection>`);
		await settle();
		expect(header(element).hidden).toBe(true);
		const heading = Object.assign(document.createElement("span"), { slot: "heading", textContent: "News" });
		element.prepend(heading);
		await settle();
		expect(header(element).hidden).toBe(false);
	});

	it("keeps the header hidden when the link has text but no href", async () => {
		const element = mount(`<ycl-card-collection><span slot="link">View all</span>${contentCards}</ycl-card-collection>`);
		await settle();
		expect(header(element).hidden).toBe(true);
		element.setAttribute("link-href", "/news");
		await settle();
		expect(header(element).hidden).toBe(false);
	});

	it("lays out cards forwarded through another slot", async () => {
		const host = mount(`<div>${contentCards}</div>`);
		const root = host.attachShadow({ mode: "open" });
		root.innerHTML = `<ycl-card-collection layout="list"><slot></slot></ycl-card-collection>`;
		await settle();
		for (const card of host.querySelectorAll("ycl-content-card")) expect(card.getAttribute("layout")).toBe("list");
	});

	it("shows the slotted cards, Content Card and Custom Card alike", async () => {
		const element = mount(`<ycl-card-collection>
			<ycl-content-card><span slot="heading">One</span></ycl-content-card>
			<ycl-custom-card><span slot="heading">Two</span></ycl-custom-card>
		</ycl-card-collection>`);
		await settle();
		const assigned = part(element, ".card-collection__cards slot").assignedElements();
		expect(assigned.map((card) => card.localName)).toEqual(["ycl-content-card", "ycl-custom-card"]);
	});

	it("gives content cards the collection's layout, defaulting to grid", async () => {
		const element = mount(`<ycl-card-collection>${contentCards}</ycl-card-collection>`);
		await settle();
		const slotted = [...element.querySelectorAll("ycl-content-card")];
		expect(slotted.map((card) => card.getAttribute("layout"))).toEqual(["grid", "grid", "grid"]);
		element.setAttribute("layout", "list");
		expect(slotted.map((card) => card.getAttribute("layout"))).toEqual(["list", "list", "list"]);
	});

	it("gives cards added later the layout too", async () => {
		const element = mount(`<ycl-card-collection layout="list"></ycl-card-collection>`);
		await settle();
		const card = document.createElement("ycl-content-card");
		element.append(card);
		await settle();
		expect(card.getAttribute("layout")).toBe("list");
	});

	it("leaves a layout the author set on a card alone", async () => {
		const element = mount(`<ycl-card-collection layout="list">
			<ycl-content-card layout="condensed"><span slot="heading">One</span></ycl-content-card>
		</ycl-card-collection>`);
		await settle();
		const card = element.querySelector("ycl-content-card");
		expect(card.getAttribute("layout")).toBe("condensed");
		element.setAttribute("layout", "grid");
		expect(card.getAttribute("layout")).toBe("condensed");
	});

	it("keeps a layout the author sets on a card after the collection laid it out", async () => {
		const element = mount(`<ycl-card-collection>${contentCards}</ycl-card-collection>`);
		await settle();
		const card = element.querySelector("ycl-content-card");
		card.setAttribute("layout", "condensed");
		element.setAttribute("layout", "list");
		expect(card.getAttribute("layout")).toBe("condensed");
	});

	it("treats an unknown layout as grid", async () => {
		const element = mount(`<ycl-card-collection layout="bogus">${contentCards}</ycl-card-collection>`);
		await settle();
		expect(element.querySelector("ycl-content-card").getAttribute("layout")).toBe("grid");
		expect(element.layout).toBe("grid");
	});

	it("lays a grid out in one column when narrow and three when wide", async () => {
		const element = mount(`<ycl-card-collection style="width: 360px">${contentCards}</ycl-card-collection>`);
		await settle();
		expect(columnCount(element)).toBe(1);
		// Content cards lay out image beside text below 768px, which needs a full row.
		element.style.width = "700px";
		await settle();
		expect(columnCount(element)).toBe(1);
		element.style.width = "800px";
		await settle();
		expect(columnCount(element)).toBe(2);
		element.style.width = "1100px";
		await settle();
		expect(columnCount(element)).toBe(3);
	});

	it("stacks a list in one column at any width", async () => {
		const element = mount(`<ycl-card-collection layout="list" style="width: 1100px">${contentCards}</ycl-card-collection>`);
		await settle();
		expect(columnCount(element)).toBe(1);
	});
});
