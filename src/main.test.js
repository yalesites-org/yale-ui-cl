import { afterEach, beforeEach, describe, expect, it } from "vitest";
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

it("gives every component except ycl-tab a shadow root", () => {
	const missing = Object.values(library)
		.map((Component) => document.createElement(customElements.getName(Component)))
		.filter((element) => {
			try { return !shadowOf(element); } catch { return true; }
		})
		.map((element) => element.localName);
	expect(missing).toEqual(["ycl-tab"]);
});
