import { afterEach, beforeEach, describe, expect, it, onTestFinished } from "vitest";
import * as library from "./main.js";
import { shadowOf } from "../test/helpers.js";

// Errors thrown from custom element callbacks are reported to window, not to the caller.
let errors;
const onError = (event) => errors.push(event.error);
beforeEach(() => {
	errors = [];
	window.addEventListener("error", onError);
});
afterEach(() => window.removeEventListener("error", onError));

describe.each(Object.entries(library))("%s", (_, Component) => {
	const tag = customElements.getName(Component);

	it("is registered", () => {
		expect(tag).toBeTruthy();
	});

	it("constructs and connects without errors", () => {
		const element = document.createElement(tag);
		expect(element).toBeInstanceOf(Component);
		document.body.append(element);
		element.remove();
		expect(errors).toEqual([]);
	});
});

// With yale-ui-cl.css loaded, normalize's document-level [hidden] rule beats any :host display
// rule, so the document sheets are switched off to check that each component hides on its own
// (as when a page loads one per-component entry without the full stylesheet).
it("hides every component while it has the hidden attribute, without the document stylesheet", () => {
	const documentSheets = [...document.styleSheets];
	documentSheets.forEach((sheet) => (sheet.disabled = true));
	onTestFinished(() => documentSheets.forEach((sheet) => (sheet.disabled = false)));

	const elements = Object.values(library).map((Component) => {
		const element = document.createElement(customElements.getName(Component));
		document.body.append(element);
		return element;
	});
	const display = () => elements.map((element) => [element.localName, getComputedStyle(element).display]);
	const shown = display();

	elements.forEach((element) => (element.hidden = true));
	expect(display().filter(([, value]) => value !== "none")).toEqual([]);

	elements.forEach((element) => (element.hidden = false));
	expect(display()).toEqual(shown);
});

it("gives every component except ycl-tab a shadow root", () => {
	const missing = Object.values(library)
		.map((Component) => document.createElement(customElements.getName(Component)))
		.filter((element) => {
			try { return !shadowOf(element); } catch { return true; }
		})
		.map((element) => element.localName);
	expect(missing).toEqual(["ycl-tab"]);
});
