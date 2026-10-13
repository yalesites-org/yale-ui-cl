import { describe, expect, it, vi } from "vitest";
import "./Checkbox.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const inner = (element) => shadowOf(element).querySelector("input");

describe("ycl-checkbox", () => {
	it("only contributes to the form while checked", () => {
		const form = mount(`<form><ycl-checkbox name="agree" value="yes">Agree</ycl-checkbox></form>`);
		const checkbox = form.firstElementChild;
		expect(new FormData(form).get("agree")).toBe(null);
		checkbox.checked = true;
		expect(new FormData(form).get("agree")).toBe("yes");
	});

	it("defaults its value to 'on'", () => {
		const form = mount(`<form><ycl-checkbox name="agree" checked></ycl-checkbox></form>`);
		expect(new FormData(form).get("agree")).toBe("on");
	});

	it("re-fires change from the host when the user toggles it", () => {
		const checkbox = mount(`<ycl-checkbox></ycl-checkbox>`);
		const onChange = vi.fn();
		checkbox.addEventListener("change", onChange);
		inner(checkbox).click();
		expect(checkbox.checked).toBe(true);
		expect(onChange).toHaveBeenCalledOnce();
	});

	it("restores its initial state on form reset", () => {
		const form = mount(`<form><ycl-checkbox checked></ycl-checkbox></form>`);
		const checkbox = form.firstElementChild;
		checkbox.checked = false;
		form.reset();
		expect(checkbox.checked).toBe(true);
	});

	it("is invalid while required and unchecked", () => {
		const checkbox = mount(`<ycl-checkbox required></ycl-checkbox>`);
		expect(checkbox.internals_.validity.valueMissing).toBe(true);
		checkbox.checked = true;
		expect(checkbox.internals_.validity.valid).toBe(true);
	});

	it("is disabled by a disabled fieldset", () => {
		const fieldset = mount(`<form><fieldset disabled><ycl-checkbox required></ycl-checkbox></fieldset></form>`).firstElementChild;
		const checkbox = fieldset.firstElementChild;
		expect(inner(checkbox).disabled).toBe(true);
		expect(checkbox.internals_.validity.valid).toBe(true);
		fieldset.disabled = false;
		expect(inner(checkbox).disabled).toBe(false);
	});
});
