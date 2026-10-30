import { describe, expect, it } from "vitest";
import stories, { Default } from "./DirectoryListingCard.stories.js";
import { mount } from "../../../../test/helpers.js";

describe("ycl-directory-listing-card", () => {
	it("shows the phone number as plain text, as YaleSites does", () => {
		const list = mount(stories.render({ ...stories.args, ...Default.args }));
		const phone = list.querySelector('[slot="phone"]');
		expect(phone.textContent.trim()).toBe(stories.args.phone);
		expect(phone.matches("a, text-link")).toBe(false);
		expect(phone.querySelector("a, text-link")).toBeNull();
	});
});
