import { describe, expect, it } from "vitest";
import "./TextInput.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const inner = (element) => shadowOf(element).querySelector("input");

describe("text-input", () => {
	it("reflects attributes onto the inner input", () => {
		const element = mount(`<text-input placeholder="Name" autocomplete="name" type="email" disabled></text-input>`);
		const input = inner(element);
		expect(input.placeholder).toBe("Name");
		expect(input.autocomplete).toBe("name");
		expect(input.type).toBe("email");
		expect(input.disabled).toBe(true);
	});

	it("ignores unsupported types", () => {
		const element = mount(`<text-input type="password"></text-input>`);
		expect(inner(element).type).toBe("text");
	});

	it("submits its value with the form", () => {
		const form = mount(`<form><text-input name="first" value="Ada"></text-input></form>`);
		expect(new FormData(form).get("first")).toBe("Ada");
	});

	it("updates its value as the user types", () => {
		const element = mount(`<text-input name="first"></text-input>`);
		const input = inner(element);
		input.value = "Grace";
		input.dispatchEvent(new Event("input"));
		expect(element.value).toBe("Grace");
	});

	it("is invalid while required and empty", () => {
		const element = mount(`<text-input class="required"></text-input>`);
		expect(element.required).toBe(true);
		expect(element.internals_.validity.valueMissing).toBe(true);
		expect(shadowOf(element).querySelector("label").classList).toContain("form-item__label--required");
		element.value = "x";
		expect(element.internals_.validity.valid).toBe(true);
	});

	it("marks the input invalid when the errors slot has content", async () => {
		const element = mount(`<text-input><span slot="errors">Required</span></text-input>`);
		await settle();
		expect(inner(element).ariaInvalid).toBe("true");
		expect(inner(element).classList).toContain("form-item__textfield--error");

		element.querySelector("[slot=errors]").remove();
		await settle();
		expect(inner(element).ariaInvalid).toBe("false");
	});

	it("has a white background so it reads on coloured sections", () => {
		// A dark colour scheme would otherwise give the native field a dark UA background
		const element = mount(`<text-input style="color-scheme: dark"></text-input>`);
		expect(getComputedStyle(inner(element)).backgroundColor).toBe("rgb(255, 255, 255)");
	});

	it("leaves room for the error icon so text does not run under it", async () => {
		const element = mount(`<text-input><span slot="errors">Required</span></text-input>`);
		await settle();
		const style = getComputedStyle(inner(element));
		// --size-spacing-4 (0.75rem) plus the 1.7rem icon
		expect(parseFloat(style.paddingRight)).toBeCloseTo(parseFloat(style.paddingLeft) + 1.7 * 16, 0);
	});
});
