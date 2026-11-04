import { describe, expect, it, vi } from "vitest";
import "./Button.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const control = (element) => shadowOf(element).querySelector(".button");

describe("ycl-button", () => {
	it("renders a button with CTA variants from its attributes", () => {
		const element = mount(`<ycl-button variant="filled" radius="pill">Go</ycl-button>`);
		expect(control(element).localName).toBe("button");
		expect(control(element).className).toBe("button cta cta--filled cta--radius-pill");
	});

	it("becomes a link when given an href, and back again", () => {
		const element = mount(`<ycl-button href="/next">Go</ycl-button>`);
		expect(control(element).localName).toBe("a");
		expect(control(element).getAttribute("href")).toBe("/next");
		element.href = null;
		expect(control(element).localName).toBe("button");
		expect(control(element).querySelector("slot")).not.toBe(null);
	});

	it("stays a button with an icon when it's a dropdown", () => {
		const element = mount(`<ycl-button href="/next" control-type="dropdown" expanded="false">Menu</ycl-button>`);
		expect(control(element).localName).toBe("button");
		expect(control(element).querySelector(".button__icon")).not.toBe(null);
		expect(control(element).getAttribute("aria-expanded")).toBe("false");
	});

	it("submits and resets its form", () => {
		const form = mount(`<form><ycl-button type="submit">Send</ycl-button><ycl-button type="reset">Clear</ycl-button></form>`);
		const [submit, reset] = form.children;
		const onSubmit = vi.fn((event) => event.preventDefault());
		const onReset = vi.fn();
		form.addEventListener("submit", onSubmit);
		form.addEventListener("reset", onReset);
		control(submit).click();
		control(reset).click();
		expect(onSubmit).toHaveBeenCalledOnce();
		expect(onReset).toHaveBeenCalledOnce();
	});

	it("swallows clicks while disabled", () => {
		const form = mount(`<form><ycl-button type="submit" disabled>Send</ycl-button></form>`);
		const onSubmit = vi.fn((event) => event.preventDefault());
		const onClick = vi.fn();
		form.addEventListener("submit", onSubmit);
		form.firstElementChild.addEventListener("click", onClick);
		form.firstElementChild.click();
		expect(onClick).not.toHaveBeenCalled();
		expect(onSubmit).not.toHaveBeenCalled();
	});
});
