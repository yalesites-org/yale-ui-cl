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

// Data-only children (static dataOnly = true) are rendered by their parent; every other component has a shadow root.
it("gives a shadow root to every component that isn't data-only, and to none that is", () => {
	const hasShadow = (Component) => {
		try { return Boolean(shadowOf(document.createElement(customElements.getName(Component)))); } catch { return false; }
	};
	const wrong = Object.values(library)
		.filter((Component) => hasShadow(Component) === Boolean(Component.dataOnly))
		.map((Component) => customElements.getName(Component));
	expect(wrong).toEqual([]);
	expect(Object.values(library).filter((Component) => Component.dataOnly).length).toBeGreaterThan(0);
});
