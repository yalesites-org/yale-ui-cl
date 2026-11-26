import { describe, expect, it } from "vitest";
import "./RelatedContent.js";
import { mount, settle } from "../../../test/helpers.js";

describe("ycl-related-content", () => {
	it("is a region named by its heading, as an attribute axe can see", async () => {
		const section = mount(`<ycl-related-content><h2 slot="heading">Related</h2></ycl-related-content>`);
		await settle();
		expect(section.getAttribute("role")).toBe("region");
		expect(section.getAttribute("aria-labelledby")).toBe(section.querySelector("h2").id);
	});

	it("drops the region role when it has no heading", async () => {
		const section = mount(`<ycl-related-content><h2 slot="heading">Related</h2></ycl-related-content>`);
		await settle();
		section.querySelector("h2").remove();
		await settle();
		expect(section.hasAttribute("role")).toBe(false);
	});

	it("becomes a region again when a heading comes back", async () => {
		const section = mount(`<ycl-related-content><h2 slot="heading">Related</h2></ycl-related-content>`);
		await settle();
		section.querySelector("h2").remove();
		await settle();
		section.insertAdjacentHTML("afterbegin", `<h2 slot="heading">Again</h2>`);
		await settle();
		expect(section.getAttribute("role")).toBe("region");
		expect(section.getAttribute("aria-labelledby")).toBe(section.querySelector("h2").id);
	});

	it("drops the region role on a clone that loses its heading", async () => {
		const section = mount(`<ycl-related-content><h2 slot="heading">Related</h2></ycl-related-content>`);
		await settle();
		const clone = section.cloneNode(true);
		document.body.append(clone);
		await settle();
		clone.querySelector("h2").remove();
		await settle();
		expect(clone.hasAttribute("role")).toBe(false);
	});

	it("keeps a role the author set", async () => {
		const section = mount(`<ycl-related-content role="complementary"><h2 slot="heading">Related</h2></ycl-related-content>`);
		await settle();
		expect(section.getAttribute("role")).toBe("complementary");
		section.querySelector("h2").remove();
		await settle();
		expect(section.getAttribute("role")).toBe("complementary");
	});
});

describe("ycl-related-content-item", () => {
	it("is an article, as an attribute axe can see", () => {
		const item = mount(`<ycl-related-content-item href="#"><h3 slot="heading">Title</h3></ycl-related-content-item>`);
		expect(item.getAttribute("role")).toBe("article");
	});

	it("gets its role when created with createElement", () => {
		const item = document.createElement("ycl-related-content-item");
		document.body.append(item);
		expect(item.getAttribute("role")).toBe("article");
	});

	it("keeps a role the author set", () => {
		const item = mount(`<ycl-related-content-item role="listitem"></ycl-related-content-item>`);
		expect(item.getAttribute("role")).toBe("listitem");
	});
});
