import { describe, expect, it } from "vitest";
import "./SelectInput.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const inner = (element) => shadowOf(element).querySelector("select");

describe("select-input", () => {
	it("moves light-DOM options into the inner select", () => {
		const element = mount(`<select-input><option value="a">A</option><optgroup label="G"><option value="b">B</option></optgroup></select-input>`);
		expect(element.children).toHaveLength(0);
		expect([...inner(element).options].map((o) => o.value)).toEqual(["a", "b"]);
	});

	it("picks up options added after connection", async () => {
		const element = mount(`<select-input></select-input>`);
		element.append(new Option("Late", "late"));
		await settle();
		expect(inner(element).options[0].value).toBe("late");
	});

	it("applies a value set before its option existed", async () => {
		const form = mount(`<form><select-input name="pick" value="b"></select-input></form>`);
		form.firstElementChild.append(new Option("A", "a"), new Option("B", "b"));
		await settle();
		expect(inner(form.firstElementChild).value).toBe("b");
		expect(new FormData(form).get("pick")).toBe("b");
	});

	it("tracks the user's choice", () => {
		const element = mount(`<select-input><option value="a">A</option><option value="b">B</option></select-input>`);
		inner(element).value = "b";
		inner(element).dispatchEvent(new Event("change"));
		expect(element.value).toBe("b");
	});
});
