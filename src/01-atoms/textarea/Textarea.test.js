import { describe, expect, it } from "vitest";
import "./Textarea.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";
import baseCss from "../../styles/base.css?raw";
import bundledCss from "../../styles/base.css?inline";

const inner = (element) => shadowOf(element).querySelector("textarea");

describe("ycl-text-area", () => {
	it("labels the inner textarea and describes it with instructions and errors", () => {
		const element = mount(`<ycl-text-area><span slot="label">Message</span><span slot="instructions">Be brief</span></ycl-text-area>`);
		const textarea = inner(element);
		expect(textarea.labels[0].querySelector("slot").assignedNodes()[0].textContent).toBe("Message");
		expect(textarea.getAttribute("aria-describedby")).toBe("instructions errors");
		expect(textarea.classList).toContain("form-item__textfield");
		expect(textarea.classList).toContain("form-item__textarea");
	});

	it("reflects attributes onto the inner textarea", () => {
		const element = mount(`<ycl-text-area placeholder="Say hello" autocomplete="off" rows="8" disabled></ycl-text-area>`);
		const textarea = inner(element);
		expect(textarea.placeholder).toBe("Say hello");
		expect(textarea.autocomplete).toBe("off");
		expect(textarea.rows).toBe(8);
		expect(textarea.disabled).toBe(true);
	});

	it("submits its value with the form", () => {
		const form = mount(`<form><ycl-text-area name="message" value="Hello"></ycl-text-area></form>`);
		expect(inner(form.firstElementChild).value).toBe("Hello");
		expect(new FormData(form).get("message")).toBe("Hello");
	});

	it("updates its value as the user types", () => {
		const form = mount(`<form><ycl-text-area name="message"></ycl-text-area></form>`);
		const element = form.firstElementChild;
		inner(element).value = "Line one\nLine two";
		inner(element).dispatchEvent(new Event("input"));
		expect(element.value).toBe("Line one\nLine two");
		expect(new FormData(form).get("message")).toBe("Line one\nLine two");
	});

	it("is invalid while required and empty", () => {
		const element = mount(`<ycl-text-area required></ycl-text-area>`);
		expect(element.required).toBe(true);
		expect(element.internals_.validity.valueMissing).toBe(true);
		expect(shadowOf(element).querySelector("label").classList).toContain("form-item__label--required");
		element.value = "x";
		expect(element.internals_.validity.valid).toBe(true);
	});

	it("shows the error state only while the errors slot has content", async () => {
		const element = mount(`<ycl-text-area><span slot="errors"></span></ycl-text-area>`);
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
		const element = mount(`<ycl-text-area style="color-scheme: dark"></ycl-text-area>`);
		expect(getComputedStyle(inner(element)).backgroundColor).toBe("rgb(255, 255, 255)");
	});

	it("has its stylesheet imported into the document stylesheet", () => {
		expect(baseCss).toMatch(/@import "\.\.\/01-atoms\/textarea\/textarea\.css" layer\(components\.textarea\);/);
	});

	it("leaves single-line text fields alone in the document stylesheet", () => {
		// Light-DOM markup styled by the bundled document stylesheet, where textarea.css's layer
		// comes after text-input's: its rules must only reach the textarea.
		const host = mount(`<div></div>`);
		const root = host.attachShadow({ mode: "open" });
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(bundledCss);
		root.adoptedStyleSheets = [sheet];
		root.innerHTML = `
			<div class="form-item"><div class="form-item__inner"><input class="form-item__textfield form-item__textfield--error"></div></div>
			<div class="form-item"><div class="form-item__inner"><textarea class="form-item__textfield form-item__textarea form-item__textfield--error"></textarea></div></div>`;
		const [input, textarea] = root.querySelectorAll(".form-item__textfield");
		const inputStyle = getComputedStyle(input);
		expect(inputStyle.display).not.toBe("block");
		expect(inputStyle.maxWidth).toBe("none");
		expect(inputStyle.backgroundPositionX).toBe("97%");
		expect(inputStyle.backgroundPositionY).toBe("50%");

		const textareaStyle = getComputedStyle(textarea);
		expect(textareaStyle.display).toBe("block");
		expect(textareaStyle.maxWidth).toBe("100%");
		expect(textareaStyle.resize).toBe("vertical");
		expect(textareaStyle.backgroundPositionY).not.toBe("50%");
	});
});
