import { describe, expect, it } from "vitest";
import "./Textarea.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const inner = (element) => shadowOf(element).querySelector("textarea");

describe("text-area", () => {
	it("labels the inner textarea and describes it with instructions and errors", () => {
		const element = mount(`<text-area><span slot="label">Message</span><span slot="instructions">Be brief</span></text-area>`);
		const textarea = inner(element);
		expect(textarea.labels[0].querySelector("slot").assignedNodes()[0].textContent).toBe("Message");
		expect(textarea.getAttribute("aria-describedby")).toBe("instructions errors");
		expect(textarea.classList).toContain("form-item__textfield");
		expect(textarea.classList).toContain("form-item__textarea");
	});

	it("reflects attributes onto the inner textarea", () => {
		const element = mount(`<text-area placeholder="Say hello" autocomplete="off" rows="8" disabled></text-area>`);
		const textarea = inner(element);
		expect(textarea.placeholder).toBe("Say hello");
		expect(textarea.autocomplete).toBe("off");
		expect(textarea.rows).toBe(8);
		expect(textarea.disabled).toBe(true);
	});

	it("submits its value with the form", () => {
		const form = mount(`<form><text-area name="message" value="Hello"></text-area></form>`);
		expect(inner(form.firstElementChild).value).toBe("Hello");
		expect(new FormData(form).get("message")).toBe("Hello");
	});

	it("updates its value as the user types", () => {
		const form = mount(`<form><text-area name="message"></text-area></form>`);
		const element = form.firstElementChild;
		inner(element).value = "Line one\nLine two";
		inner(element).dispatchEvent(new Event("input"));
		expect(element.value).toBe("Line one\nLine two");
		expect(new FormData(form).get("message")).toBe("Line one\nLine two");
	});

	it("is invalid while required and empty", () => {
		const element = mount(`<text-area class="required"></text-area>`);
		expect(element.required).toBe(true);
		expect(element.internals_.validity.valueMissing).toBe(true);
		expect(shadowOf(element).querySelector("label").classList).toContain("form-item__label--required");
		element.value = "x";
		expect(element.internals_.validity.valid).toBe(true);
	});

	it("shows the error state only while the errors slot has content", async () => {
		const element = mount(`<text-area><span slot="errors"></span></text-area>`);
		await settle();
		expect(inner(element).ariaInvalid).toBe("false");
		expect(inner(element).classList).not.toContain("form-item__textfield--error");

		element.querySelector("[slot=errors]").textContent = "Required";
		element.append(element.querySelector("[slot=errors]"));
		await settle();
		expect(inner(element).ariaInvalid).toBe("true");
		expect(inner(element).classList).toContain("form-item__textfield--error");
		const style = getComputedStyle(inner(element));
		expect(parseFloat(style.borderTopWidth)).toBeGreaterThan(1);
		expect(parseFloat(style.paddingRight)).toBeCloseTo(parseFloat(style.paddingLeft) + 1.7 * 16, 0);

		element.querySelector("[slot=errors]").remove();
		await settle();
		expect(inner(element).ariaInvalid).toBe("false");
		expect(inner(element).classList).not.toContain("form-item__textfield--error");
	});

	it("has a white background so it reads on coloured sections", () => {
		const element = mount(`<text-area style="color-scheme: dark"></text-area>`);
		expect(getComputedStyle(inner(element)).backgroundColor).toBe("rgb(255, 255, 255)");
	});
});
