import { describe, expect, it } from "vitest";
import "./SelectInput.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const inner = (element) => shadowOf(element).querySelector("select");

describe("ycl-select-input", () => {
	it("reflects the required attribute onto the inner select and the property", () => {
		const element = mount(`<ycl-select-input required></ycl-select-input>`);
		expect(element.required).toBe(true);
		expect(inner(element).required).toBe(true);
		element.required = false;
		expect(element.hasAttribute("required")).toBe(false);
		expect(inner(element).required).toBe(false);
	});

	it("moves light-DOM options into the inner select", () => {
		const element = mount(`<ycl-select-input><option value="a">A</option><optgroup label="G"><option value="b">B</option></optgroup></ycl-select-input>`);
		expect(element.children).toHaveLength(0);
		expect([...inner(element).options].map((o) => o.value)).toEqual(["a", "b"]);
	});

	it("picks up options added after connection", async () => {
		const element = mount(`<ycl-select-input></ycl-select-input>`);
		element.append(new Option("Late", "late"));
		await settle();
		expect(inner(element).options[0].value).toBe("late");
	});

	it("applies a value set before its option existed", async () => {
		const form = mount(`<form><ycl-select-input name="pick" value="b"></ycl-select-input></form>`);
		form.firstElementChild.append(new Option("A", "a"), new Option("B", "b"));
		await settle();
		expect(inner(form.firstElementChild).value).toBe("b");
		expect(new FormData(form).get("pick")).toBe("b");
	});

	it("tracks the user's choice", () => {
		const element = mount(`<ycl-select-input><option value="a">A</option><option value="b">B</option></ycl-select-input>`);
		inner(element).value = "b";
		inner(element).dispatchEvent(new Event("change"));
		expect(element.value).toBe("b");
	});

	it("lets clicks on the arrow reach the select", () => {
		const element = mount(`<ycl-select-input><option>A</option></ycl-select-input>`);
		const dropdown = shadowOf(element).querySelector(".form-item__dropdown");
		expect(getComputedStyle(dropdown, "::after").pointerEvents).toBe("none");
	});

	it("draws one border, on the wrapper, not on the select", () => {
		const element = mount(`<ycl-select-input><option>A</option></ycl-select-input>`);
		const select = getComputedStyle(inner(element));
		expect(select.borderTopColor).toBe("rgba(0, 0, 0, 0)");
		expect(select.borderTopWidth).toBe("1px");
	});

	it("keeps the select's own border transparent while focused", () => {
		const element = mount(`<ycl-select-input><option>A</option></ycl-select-input>`);
		inner(element).focus();
		expect(shadowOf(element).activeElement).toBe(inner(element));
		expect(getComputedStyle(inner(element)).borderTopColor).toBe("rgba(0, 0, 0, 0)");
	});

	it("draws one red 2px border on the wrapper in the error state, even while focused", async () => {
		const element = mount(`<ycl-select-input><option>A</option><span slot="errors">Pick one</span></ycl-select-input>`);
		await settle();
		const root = shadowOf(element);
		const dropdown = root.querySelector(".form-item__dropdown");
		// The error text is painted in --color-form-item-error, so it gives the resolved red
		const red = getComputedStyle(root.querySelector(".form-item__error-text")).color;
		expect(inner(element).classList.contains("form-item__select--error")).toBe(true);
		expect(getComputedStyle(inner(element)).borderTopColor).toBe("rgba(0, 0, 0, 0)");
		expect(getComputedStyle(dropdown).borderTopWidth).toBe("2px");
		expect(getComputedStyle(dropdown).borderTopColor).toBe(red);
		inner(element).focus();
		expect(getComputedStyle(inner(element)).borderTopColor).toBe("rgba(0, 0, 0, 0)");
		expect(getComputedStyle(dropdown).borderTopColor).toBe(red);
	});

	it("turns the arrow blue when the select has focus", () => {
		const element = mount(`<ycl-select-input><option>A</option></ycl-select-input>`);
		const dropdown = shadowOf(element).querySelector(".form-item__dropdown");
		const before = getComputedStyle(dropdown, "::after").backgroundColor;
		inner(element).focus();
		const after = getComputedStyle(dropdown, "::after").backgroundColor;
		expect(after).not.toBe(before);
		expect(after).toBe("rgb(62, 117, 172)"); // --color-blue-horizon, hsl(210, 47%, 46%)
	});
});
