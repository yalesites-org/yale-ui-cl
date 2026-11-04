import { describe, expect, it } from "vitest";
import "./CustomCard.js";
import { mount, shadowOf } from "../../../../test/helpers.js";

const icons = (card) => shadowOf(card).querySelectorAll(".custom-card__heading-link .fa-icon");
const card = (href) => mount(`<ycl-custom-card href="${href}"><h3 slot="heading">Title</h3></ycl-custom-card>`);

describe("ycl-custom-card", () => {
	it("marks an external title link with the external icon", () => {
		expect([...icons(card("https://example.com/"))].map((icon) => icon.ariaLabel)).toEqual(["(link is external)"]);
	});

	it("marks a file title link with the download icon, keeping a single icon as href changes", () => {
		const element = card("https://example.com/");
		element.href = "https://example.com/handbook.pdf";
		expect([...icons(element)].map((icon) => icon.ariaLabel)).toEqual(["(link is a download)"]);
	});

	it("adds no icon to an internal title link", () => {
		expect(icons(card("/about"))).toHaveLength(0);
	});
});
