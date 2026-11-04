import { describe, expect, it } from "vitest";
import "./TileItem.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const content = (tile) => shadowOf(tile).querySelector(".tile__item__content");
const icons = (tile) => content(tile).querySelectorAll(".fa-icon");

describe("ycl-tile-item", () => {
	it("marks an external link with the external icon", () => {
		const tile = mount(`<ycl-tile-item href="https://example.com/">Out</ycl-tile-item>`);
		expect(icons(tile)).toHaveLength(1);
		expect(icons(tile)[0].ariaLabel).toBe("(link is external)");
	});

	it("marks a file link with the download icon, keeping a single icon as href changes", () => {
		const tile = mount(`<ycl-tile-item href="https://example.com/">Out</ycl-tile-item>`);
		tile.href = "https://example.com/report.pdf";
		expect(icons(tile)).toHaveLength(1);
		expect(icons(tile)[0].ariaLabel).toBe("(link is a download)");
	});

	it("adds no icon to an internal link, and drops it when the link goes", () => {
		expect(icons(mount(`<ycl-tile-item href="/about">About</ycl-tile-item>`))).toHaveLength(0);
		const tile = mount(`<ycl-tile-item href="https://example.com/">Out</ycl-tile-item>`);
		tile.removeAttribute("href");
		expect(icons(tile)).toHaveLength(0);
	});
});
