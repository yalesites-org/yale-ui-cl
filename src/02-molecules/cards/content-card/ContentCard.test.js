import { describe, expect, it } from "vitest";
import * as library from "../../../main.js";
import { mount, shadowOf } from "../../../../test/helpers.js";

const icons = (card) => shadowOf(card).querySelectorAll(".content-card__heading-link .fa-icon");
const card = (href) => mount(`<ycl-content-card href="${href}"><h3 slot="heading">Title</h3></ycl-content-card>`);

describe("ycl-content-card", () => {
	it("registers ycl-content-card as the ContentCard export and not ycl-reference-card", () => {
		expect(library.ContentCard).toBeDefined();
		expect(customElements.get("ycl-content-card")).toBe(library.ContentCard);
		expect(customElements.get("ycl-reference-card")).toBeUndefined();
	});

	it("renders a .content-card wrapper in its shadow root", () => {
		const element = mount(`<ycl-content-card href="#"><span slot="heading">Title</span></ycl-content-card>`);
		expect(shadowOf(element).querySelector(".content-card")).not.toBeNull();
	});

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
