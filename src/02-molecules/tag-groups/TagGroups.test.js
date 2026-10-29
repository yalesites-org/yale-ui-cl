import { describe, expect, it } from "vitest";
import "./TagGroups.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

describe("ycl-tag-group", () => {
	it("renders the label attribute into the shadow label", () => {
		const el = mount(`<ycl-tag-group label="Audience"></ycl-tag-group>`);
		expect(shadowOf(el).querySelector(".tag-groups__item__label").textContent).toBe("Audience");
		el.label = "Type";
		expect(shadowOf(el).querySelector(".tag-groups__item__label").textContent).toBe("Type");
	});

	it('shows "None" when no links are slotted', async () => {
		const el = mount(`<ycl-tag-group label="Audience"></ycl-tag-group>`);
		await settle();
		const none = shadowOf(el).querySelector(".tag-groups__item__none");
		expect(none.textContent).toBe("None");
		expect(none.hidden).toBe(false);
	});

	it('hides "None" when links are slotted', async () => {
		const el = mount(`<ycl-tag-group label="Audience"><a href="#">Graduates</a></ycl-tag-group>`);
		await settle();
		expect(shadowOf(el).querySelector(".tag-groups__item__none").hidden).toBe(true);
	});
});

describe("ycl-tag-groups", () => {
	it("contains a list", () => {
		const el = mount(`<ycl-tag-groups><ycl-tag-group label="Audience"></ycl-tag-group></ycl-tag-groups>`);
		expect(shadowOf(el).querySelector('[role="list"]')).not.toBeNull();
	});
});
