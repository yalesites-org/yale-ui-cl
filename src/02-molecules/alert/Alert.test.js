import { describe, expect, it } from "vitest";
import "./Alert.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const toggle = (alert) => shadowOf(alert).querySelector(".alert__toggle");

describe("ycl-alert", () => {
	it("collapses and expands an emergency alert", () => {
		const alert = mount(`<ycl-alert type="emergency">Text</ycl-alert>`);
		expect(toggle(alert).getAttribute("aria-expanded")).toBe("true");
		toggle(alert).click();
		expect(alert.state).toBe("collapsed");
		expect(toggle(alert).getAttribute("aria-expanded")).toBe("false");
		toggle(alert).click();
		expect(alert.state).toBe("expanded");
	});

	it("dismisses other alerts", () => {
		const alert = mount(`<ycl-alert type="announcement">Text</ycl-alert>`);
		expect(toggle(alert).hasAttribute("aria-expanded")).toBe(false);
		toggle(alert).click();
		expect(alert.state).toBe("dismissed");
	});

	it("remembers its state by alert-id", () => {
		toggle(mount(`<ycl-alert alert-id="42">Text</ycl-alert>`)).click();
		expect(localStorage.getItem("ys-alert-id-42")).toBe("dismissed");
		document.body.replaceChildren();
		expect(mount(`<ycl-alert alert-id="42">Text</ycl-alert>`).state).toBe("dismissed");
	});

	it("hides wrappers for empty slots", () => {
		const alert = mount(`<ycl-alert>
		</ycl-alert>`);
		expect(shadowOf(alert).querySelector(".alert__text").hidden).toBe(true);
		expect(shadowOf(alert).querySelector(".alert__link").hidden).toBe(true);
	});
});
