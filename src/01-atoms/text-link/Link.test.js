import { describe, expect, it } from "vitest";
import "./Link.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const link = (element) => shadowOf(element).querySelector("a");

describe("text-link", () => {
	it("forwards href, target and variants to the inner link", () => {
		const element = mount(`<text-link href="/about" target="_self" class="subtle">About</text-link>`);
		expect(link(element).getAttribute("href")).toBe("/about");
		expect(link(element).target).toBe("_self");
		expect(link(element).classList).toContain("link--subtle");
	});

	it("labels external links and keeps a single icon as href changes", () => {
		const element = mount(`<text-link href="https://example.com/">Out</text-link>`);
		expect(link(element).querySelector(".fa-icon").ariaLabel).toBe("(link is external)");
		element.href = "https://example.com/doc.pdf";
		expect(link(element).querySelectorAll(".fa-icon")).toHaveLength(1);
		expect(link(element).querySelector(".fa-icon").ariaLabel).toBe("(link is a download)");
	});
});
