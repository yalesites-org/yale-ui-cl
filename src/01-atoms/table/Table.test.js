import { describe, expect, it } from "vitest";
import "./Table.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const wrapper = (element) => shadowOf(element).querySelector(".table-wrapper");
const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

const table = (columns) => `
	<table>
		<caption>Results</caption>
		<thead><tr>${"<th>Heading</th>".repeat(columns)}</tr></thead>
		<tbody><tr>${"<td>Cell</td>".repeat(columns)}</tr></tbody>
	</table>`;

describe("yc-table", () => {
	it("scrolls sideways instead of overflowing the page", async () => {
		const element = mount(`<yc-table style="display: block; width: 300px">${table(10)}</yc-table>`);
		await frame();
		const scroller = wrapper(element);
		expect(getComputedStyle(scroller).overflowX).toBe("auto");
		expect(scroller.scrollWidth).toBeGreaterThan(scroller.clientWidth);
		expect(element.getBoundingClientRect().width).toBe(300);
	});

	it("makes the wrapper a labelled, focusable region only while it scrolls", async () => {
		const element = mount(`<yc-table style="display: block; width: 300px">${table(10)}</yc-table>`);
		await frame();
		const scroller = wrapper(element);
		expect(scroller.tabIndex).toBe(0);
		expect(scroller.getAttribute("role")).toBe("region");
		expect(scroller.getAttribute("aria-label")).toBe("Results");

		element.style.width = "2000px";
		await frame();
		expect(scroller.hasAttribute("tabindex")).toBe(false);
		expect(scroller.hasAttribute("role")).toBe(false);
		expect(scroller.hasAttribute("aria-label")).toBe(false);
	});

	it("relabels the region when the caption text changes", async () => {
		const element = mount(`<yc-table style="display: block; width: 300px">${table(10)}</yc-table>`);
		await frame();
		element.querySelector("caption").textContent = "Updated results";
		await frame();
		expect(wrapper(element).getAttribute("aria-label")).toBe("Updated results");
	});

	it("keeps the tab stop while focused, and drops it on blur once the table fits", async () => {
		const element = mount(`<yc-table style="display: block; width: 300px">${table(10)}</yc-table>`);
		await frame();
		const scroller = wrapper(element);
		scroller.focus();
		expect(shadowOf(element).activeElement).toBe(scroller);

		element.style.width = "2000px";
		await frame();
		expect(scroller.tabIndex).toBe(0);
		expect(shadowOf(element).activeElement).toBe(scroller);

		scroller.blur();
		await frame();
		expect(scroller.hasAttribute("tabindex")).toBe(false);
		expect(scroller.hasAttribute("role")).toBe(false);
		expect(scroller.hasAttribute("aria-label")).toBe(false);
	});

	it("does not add a tab stop to a table that fits", async () => {
		const element = mount(`<yc-table style="display: block; width: 2000px">${table(2)}</yc-table>`);
		await frame();
		expect(wrapper(element).hasAttribute("tabindex")).toBe(false);
	});

	it("sets table text in the body-s-condensed style", () => {
		const element = mount(`<yc-table>${table(2)}</yc-table>`);
		const style = getComputedStyle(element.querySelector("td"));
		expect(style.fontFamily).toContain("Mallory Compact");
		expect(style.lineHeight).not.toBe("normal");
	});
});
