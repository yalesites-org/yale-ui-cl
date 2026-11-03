import { describe, expect, it } from "vitest";
import * as library from "../../../main.js";
import { mount, shadowOf } from "../../../../test/helpers.js";

describe("ycl-content-card", () => {
	it("registers ycl-content-card as the ContentCard export and not ycl-reference-card", () => {
		expect(library.ContentCard).toBeDefined();
		expect(customElements.get("ycl-content-card")).toBe(library.ContentCard);
		expect(customElements.get("ycl-reference-card")).toBeUndefined();
	});

	it("renders a .content-card wrapper in its shadow root", () => {
		const card = mount(`<ycl-content-card href="#"><span slot="heading">Title</span></ycl-content-card>`);
		expect(shadowOf(card).querySelector(".content-card")).not.toBeNull();
	});
});
