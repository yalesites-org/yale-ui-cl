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

	it("sizes a row to its content rather than a fixed minimum height", async () => {
		const tiles = mount(`<ycl-tiles style="display: block; width: 40rem;"><ycl-tile-item>Short</ycl-tile-item></ycl-tiles>`);
		const alone = mount(`<ycl-tile-item style="width: 40rem;">Short</ycl-tile-item>`);
		await settle();
		const height = (tile) => tile.getBoundingClientRect().height;
		expect(height(tiles.querySelector("ycl-tile-item"))).toBe(height(alone));
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

describe("ycl-tiles options", () => {
	const options = { alignment: "center", "vertical-alignment": "bottom", presentation: "icon" };

	it("copies its alignment, vertical-alignment and presentation onto every tile, over the tile's own", async () => {
		const tiles = mount(`
			<ycl-tiles alignment="center" vertical-alignment="bottom" presentation="icon">
				<ycl-tile-item>One</ycl-tile-item>
				<ycl-tile-item alignment="right" presentation="heading">Two</ycl-tile-item>
			</ycl-tiles>
		`);
		await settle();
		[...tiles.children].forEach((tile) => {
			Object.entries(options).forEach(([name, value]) => expect(tile.getAttribute(name), name).toBe(value));
		});
	});

	it("copies its options onto a tile added later", async () => {
		const tiles = mount(`<ycl-tiles alignment="center" vertical-alignment="bottom" presentation="icon"></ycl-tiles>`);
		await settle();
		const tile = document.createElement("ycl-tile-item");
		tiles.append(tile);
		await settle();
		Object.entries(options).forEach(([name, value]) => expect(tile.getAttribute(name), name).toBe(value));
	});

	it("updates its tiles when an option changes, and removes it from them when it's removed", async () => {
		const tiles = mount(`<ycl-tiles alignment="center"><ycl-tile-item>One</ycl-tile-item></ycl-tiles>`);
		await settle();
		const tile = tiles.querySelector("ycl-tile-item");
		tiles.alignment = "right";
		expect(tile.getAttribute("alignment")).toBe("right");
		tiles.removeAttribute("alignment");
		expect(tile.hasAttribute("alignment")).toBe(false);
	});

	it("leaves a tile's own options alone when the group doesn't set them", async () => {
		const tiles = mount(`
			<ycl-tiles>
				<ycl-tile-item alignment="right" vertical-alignment="bottom" presentation="heading">One</ycl-tile-item>
			</ycl-tiles>
		`);
		await settle();
		const tile = tiles.querySelector("ycl-tile-item");
		expect(tile.getAttribute("alignment")).toBe("right");
		expect(tile.getAttribute("vertical-alignment")).toBe("bottom");
		expect(tile.getAttribute("presentation")).toBe("heading");
	});

	it("exposes its options as properties", () => {
		const tiles = mount(`<ycl-tiles alignment="center"></ycl-tiles>`);
		expect(tiles.alignment).toBe("center");
		tiles.verticalAlignment = "bottom";
		tiles.presentation = "text-only";
		expect(tiles.getAttribute("vertical-alignment")).toBe("bottom");
		expect(tiles.getAttribute("presentation")).toBe("text-only");
	});
});

describe("ycl-tile-item presentation", () => {
	const shown = (tile) => {
		const display = (name) => getComputedStyle(shadowOf(tile).querySelector(`.tile__item__${name}`)).display !== "none";
		return { icon: display("icon"), heading: display("heading") };
	};
	const markup = (presentation) => `
		<ycl-tile-item ${presentation ? `presentation="${presentation}"` : ""}>
			<span slot="icon">*</span><span slot="heading">01</span>Content
		</ycl-tile-item>`;

	it("shows only the area its presentation names", async () => {
		const heading = mount(markup("heading"));
		const icon = mount(markup("icon"));
		const textOnly = mount(markup("text-only"));
		await settle();
		expect(shown(heading)).toEqual({ icon: false, heading: true });
		expect(shown(icon)).toEqual({ icon: true, heading: false });
		expect(shown(textOnly)).toEqual({ icon: false, heading: false });
		expect(textOnly.presentation).toBe("text-only");
	});

	it("shows whatever is slotted without a presentation", async () => {
		const tile = mount(markup());
		const empty = mount(`<ycl-tile-item>Content</ycl-tile-item>`);
		await settle();
		expect(shown(tile)).toEqual({ icon: true, heading: true });
		expect(shown(empty)).toEqual({ icon: false, heading: false });
	});
});

describe("ycl-tile-item vertical alignment", () => {
	const justify = (tile) => getComputedStyle(shadowOf(tile).querySelector(".tile__item__inner")).justifyContent;

	it("aligns its content to the bottom by default", async () => {
		const tile = mount(`<ycl-tile-item>Content</ycl-tile-item>`);
		await settle();
		expect(justify(tile)).toBe("flex-end");
		expect(tile.verticalAlignment).toBe("bottom");
	});

	it("aligns its content to the top when vertical-alignment is top", async () => {
		const tile = mount(`<ycl-tile-item vertical-alignment="top">Content</ycl-tile-item>`);
		await settle();
		expect(["flex-start", "normal"]).toContain(justify(tile));
		expect(tile.verticalAlignment).toBe("top");
	});

	it("reflects the verticalAlignment property to the attribute", () => {
		const tile = mount(`<ycl-tile-item>Content</ycl-tile-item>`);
		tile.verticalAlignment = "top";
		expect(tile.getAttribute("vertical-alignment")).toBe("top");
		expect(tile.verticalAlignment).toBe("top");
		tile.verticalAlignment = "bottom";
		expect(tile.verticalAlignment).toBe("bottom");
	});
});
