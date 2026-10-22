import { describe, expect, it } from "vitest";
import "./Tiles.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const linkIcon = (tile) => shadowOf(tile).querySelector(".tile__item__content .fa-icon");

describe("ycl-tiles", () => {
	it("registers ycl-tile-item along with itself", () => {
		expect(customElements.get("ycl-tiles")).toBeTruthy();
		expect(customElements.get("ycl-tile-item")).toBeTruthy();
	});

	it("exposes its items as a list, one list item per tile", async () => {
		const tiles = mount(`
			<ycl-tiles>
				<ycl-tile-item>One</ycl-tile-item>
				<ycl-tile-item>Two</ycl-tile-item>
			</ycl-tiles>
		`);
		await settle();
		const list = shadowOf(tiles).querySelector("ul");
		const items = [...list.children];
		expect(items.map((item) => item.localName)).toEqual(["li", "li"]);
		expect(items.map((item) => item.querySelector("slot").assignedElements())).toEqual(
			[...tiles.children].map((tile) => [tile]),
		);
	});

	it("adds a list item when a tile is added", async () => {
		const tiles = mount(`<ycl-tiles><ycl-tile-item>One</ycl-tile-item></ycl-tiles>`);
		await settle();
		tiles.append(document.createElement("ycl-tile-item"));
		await settle();
		expect(shadowOf(tiles).querySelectorAll("ul > li")).toHaveLength(2);
	});

	it("stretches a short tile to the height of its row", async () => {
		const tiles = mount(`
			<ycl-tiles style="display: block; width: 40rem;">
				<ycl-tile-item>Short</ycl-tile-item>
				<ycl-tile-item>${"A much longer tile with a lot more content in it. ".repeat(12)}</ycl-tile-item>
			</ycl-tiles>
		`);
		await settle();
		const [short, long] = tiles.children;
		const box = (tile) => shadowOf(tile).querySelector(".tile__item").getBoundingClientRect();
		expect(box(short).top).toBe(box(long).top);
		expect(box(short).height).toBe(box(long).height);
	});
});

describe("ycl-tile-item", () => {
	it("fills its own height, e.g. a min-height set on the tile", () => {
		const tile = mount(`<ycl-tile-item style="min-height: 18rem;">Content</ycl-tile-item>`);
		const inner = shadowOf(tile).querySelector(".tile__item");
		expect(inner.getBoundingClientRect().height).toBe(tile.getBoundingClientRect().height);
	});

	it("shows the external link icon for an external href", () => {
		const tile = mount(`<ycl-tile-item href="https://example.com/page">Content</ycl-tile-item>`);
		expect(linkIcon(tile)?.getAttribute("aria-label")).toBe("(link is external)");
	});

	it("shows no link icon for an internal href or no href", () => {
		const internal = mount(`<ycl-tile-item href="/about">Content</ycl-tile-item>`);
		const unlinked = mount(`<ycl-tile-item>Content</ycl-tile-item>`);
		expect(linkIcon(internal)).toBeNull();
		expect(linkIcon(unlinked)).toBeNull();
	});

	it("drops the icon when the href is removed or made internal", () => {
		const tile = mount(`<ycl-tile-item href="https://example.com/">Content</ycl-tile-item>`);
		tile.setAttribute("href", "/about");
		expect(linkIcon(tile)).toBeNull();
		tile.setAttribute("href", "https://example.com/");
		tile.removeAttribute("href");
		expect(linkIcon(tile)).toBeNull();
	});
});

describe("ycl-tiles children", () => {
	it("lists only ycl-tile-item children", async () => {
		const tiles = mount(`
			<ycl-tiles>
				<ycl-tile-item>One</ycl-tile-item>
				<template><ycl-tile-item>Inert</ycl-tile-item></template>
				<div>Not a tile</div>
			</ycl-tiles>
		`);
		await settle();
		const slots = [...shadowOf(tiles).querySelectorAll("ul > li slot")];
		expect(slots.map((slot) => slot.assignedElements())).toEqual([[tiles.querySelector("ycl-tile-item")]]);
	});
});
