import { describe, expect, it, vi } from "vitest";
import { userEvent } from "vitest/browser";
import "./Button.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const control = (element) => shadowOf(element).querySelector(".button");

describe("ycl-button", () => {
	it("renders a button with CTA variants from its attributes", () => {
		const element = mount(`<ycl-button variant="filled" radius="pill">Go</ycl-button>`);
		expect(control(element).localName).toBe("button");
		expect(control(element).className).toBe("button cta cta--filled cta--radius-pill");
	});

	it("takes an outline weight, and ignores the removed size and secondary variant", () => {
		const element = mount(`<ycl-button variant="outline" outline-weight="1" size="large">Go</ycl-button>`);
		expect(control(element).className).toBe("button cta cta--outline cta--outline-weight-1");
		element.setAttribute("variant", "secondary");
		expect(control(element).className).toBe("button cta cta--outline-weight-1");
	});

	it("is filled when no variant is set", () => {
		const style = getComputedStyle(control(mount(`<ycl-button>Go</ycl-button>`)));
		expect(style.backgroundColor).not.toBe("rgba(0, 0, 0, 0)");
		expect(style.backgroundColor).toBe(style.borderTopColor);
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

	it("keeps its resting look on hover while disabled", async () => {
		const wrapper = mount(`<div><ycl-button variant="outline" animate="wipe" disabled>Wipe</ycl-button><ycl-button animate="rise" disabled>Rise</ycl-button></div>`);
		const [wipe, rise] = wrapper.children;
		// Hover the host: the pointer lands on the inner button, and userEvent can't address a node
		// inside a closed shadow root. Finishing the transition reads the end state, not a midpoint.
		const hovered = async (host) => {
			await userEvent.hover(host);
			control(host).getAnimations().forEach((animation) => animation.finish());
			return getComputedStyle(control(host));
		};
		expect((await hovered(wipe)).boxShadow).toBe("none");
		const riseStyle = await hovered(rise);
		expect(riseStyle.boxShadow).toBe("none");
		expect(riseStyle.transform).toBe("none");
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
