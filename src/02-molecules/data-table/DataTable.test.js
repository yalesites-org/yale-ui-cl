import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { setProjectAnnotations } from "@storybook/web-components-vite";
import { composeStories } from "storybook/preview-api";
import preview from "../../../.storybook/preview.js";
import * as stories from "./DataTable.stories.js";
import * as pages from "../../05-page-examples/PageExamples.stories.js";
import "./DataTable.js";
import "../../styles/base.css";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const markup = `
	<ycl-data-table label="Search people">
		<table>
			<thead>
				<tr><th>Name</th><th>Age</th><th>Code</th><th data-no-sort>Notes</th></tr>
			</thead>
			<tbody>
				<tr><td>Charlie</td><td>9</td><td>10</td><td>Tall</td></tr>
				<tr><td>alice</td><td>$1,200</td><td>9</td><td></td></tr>
				<tr><td>Bob</td><td></td><td>2</td><td>Tall and quiet</td></tr>
			</tbody>
		</table>
	</ycl-data-table>`;

const names = (el) => [...el.table.tBodies[0].rows].map((row) => row.cells[0].textContent);
const visible = (el) => [...el.table.tBodies[0].rows].filter((row) => !row.hidden).map((row) => row.cells[0].textContent);
const buttons = (el) => [...el.table.tHead.querySelectorAll("button")];
const status = (el) => shadowOf(el).querySelector('[role="status"]').textContent;
const frame = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
const region = (el) => shadowOf(shadowOf(el).querySelector("ycl-table")).querySelector(".table-wrapper");
const wide = (caption) => `
	<table>
		${caption}
		<thead><tr>${"<th>Heading</th>".repeat(10)}</tr></thead>
		<tbody><tr>${"<td>Cell</td>".repeat(10)}</tr></tbody>
	</table>`;

describe("ycl-data-table", () => {
	it("turns sortable headers into buttons, keeping their content", () => {
		const el = mount(markup);
		expect(buttons(el).map((b) => b.textContent)).toEqual(["Name", "Age", "Code"]);
		expect(el.table.tHead.rows[0].cells[3].querySelector("button")).toBeNull();
	});

	it("labels the search field", () => {
		const el = mount(markup);
		expect(shadowOf(el).querySelector('[slot="label"]').textContent).toBe("Search people");
	});

	it("sorts text ascending then descending, case-insensitively", () => {
		const el = mount(markup);
		buttons(el)[0].click();
		expect(el.table.tHead.rows[0].cells[0].getAttribute("aria-sort")).toBe("ascending");
		expect(names(el)).toEqual(["alice", "Bob", "Charlie"]);
		buttons(el)[0].click();
		expect(el.table.tHead.rows[0].cells[0].getAttribute("aria-sort")).toBe("descending");
		expect(names(el)).toEqual(["Charlie", "Bob", "alice"]);
	});

	it("sorts numbers by value and keeps blanks last", () => {
		const el = mount(markup);
		buttons(el)[1].click();
		expect(names(el)).toEqual(["Charlie", "alice", "Bob"]);
		buttons(el)[1].click();
		expect(names(el)).toEqual(["alice", "Charlie", "Bob"]);
	});

	it("only marks one column as sorted", () => {
		const el = mount(markup);
		buttons(el)[0].click();
		buttons(el)[2].click();
		expect([...el.table.tHead.querySelectorAll("[aria-sort]")]).toEqual([el.table.tHead.rows[0].cells[2]]);
	});

	it("sorts by data-sort-value over the cell text", () => {
		const el = mount(markup.replace("<td>Charlie</td>", '<td data-sort-value="Aaron">Charlie</td>'));
		buttons(el)[0].click();
		expect(names(el)).toEqual(["Charlie", "alice", "Bob"]);
	});

	it("sorts each numeric column by value", () => {
		const el = mount(markup);
		buttons(el)[2].click();
		expect(names(el)).toEqual(["Bob", "alice", "Charlie"]);
	});

	it("presorts by an authored aria-sort", () => {
		const el = mount(markup.replace("<th>Name</th>", '<th aria-sort="descending">Name</th>'));
		expect(names(el)).toEqual(["Charlie", "Bob", "alice"]);
	});

	it("filters rows on every search term and reports the count", () => {
		const el = mount(markup);
		el.query = "tall";
		expect(visible(el)).toEqual(["Charlie", "Bob"]);
		expect(status(el)).toBe("Showing 2 of 3 rows");
		el.query = "quiet TALL";
		expect(visible(el)).toEqual(["Bob"]);
		el.query = "nobody";
		expect(visible(el)).toEqual([]);
		expect(status(el)).toBe("No rows match your search");
		el.query = "";
		expect(visible(el)).toEqual(["Charlie", "alice", "Bob"]);
		expect(status(el)).toBe("");
	});

	it("filters as the user types", () => {
		const el = mount(markup);
		const input = shadowOf(shadowOf(el).querySelector("ycl-text-input")).querySelector("input");
		input.value = "bob";
		input.dispatchEvent(new InputEvent("input", { bubbles: true, composed: true }));
		expect(visible(el)).toEqual(["Bob"]);
	});

	it("keeps sort and filter applied to rows added later", async () => {
		const el = mount(markup);
		buttons(el)[0].click();
		el.query = "tall";
		el.table.tBodies[0].insertAdjacentHTML("beforeend", "<tr><td>Aaron</td><td>1</td><td>1</td><td>Tall</td></tr><tr><td>Zed</td><td>1</td><td>1</td><td></td></tr>");
		await settle();
		expect(names(el)).toEqual(["Aaron", "alice", "Bob", "Charlie", "Zed"]);
		expect(visible(el)).toEqual(["Aaron", "Bob", "Charlie"]);
	});

	it("names the scroll region of a wide table after its caption", async () => {
		const el = mount(`<ycl-data-table style="display: block; width: 300px">${wide("<caption>Results</caption>")}</ycl-data-table>`);
		await frame();
		const scroller = region(el);
		expect(scroller.getAttribute("role")).toBe("region");
		expect(scroller.getAttribute("aria-label")).toBe("Results");

		el.table.caption.textContent = "Updated results";
		await frame();
		expect(scroller.getAttribute("aria-label")).toBe("Updated results");
	});

	it("falls back to naming the scroll region Table when there is no caption", async () => {
		const el = mount(`<ycl-data-table style="display: block; width: 300px">${wide("")}</ycl-data-table>`);
		await frame();
		expect(region(el).getAttribute("role")).toBe("region");
		expect(region(el).getAttribute("aria-label")).toBe("Table");
	});
});

// WCAG 1.4.10 (reflow): a wide table scrolls inside its own box, never the page, at a phone width.
describe("ycl-data-table on a 375px screen", () => {
	const annotations = setProjectAnnotations(preview);
	const pageOverflow = () => document.documentElement.scrollWidth - document.documentElement.clientWidth;
	// Stories return markup or, for the page examples, a node.
	const show = async (output) => {
		if (typeof output === "string") document.body.innerHTML = output;
		else document.body.replaceChildren(output);
		await frame();
	};
	let size;
	beforeAll(async () => {
		size = [window.innerWidth, window.innerHeight];
		await page.viewport(375, 812);
	});
	afterAll(() => page.viewport(...size));

	it.each(Object.entries(composeStories(stories, annotations)))("the %s story doesn't scroll the page sideways", async (_, Story) => {
		await show(Story());
		expect(pageOverflow()).toBe(0);
	});

	it("the Courses page example doesn't scroll the page sideways", async () => {
		await show(composeStories(pages, annotations).DirectoryListing());
		expect(document.querySelector("ycl-data-table")).not.toBeNull();
		expect(pageOverflow()).toBe(0);
	});

	// Flex and grid items don't shrink below their content by default, so a wide table would
	// otherwise stretch its flex row or grid column past the screen.
	it.each(["display: flex", "display: grid; grid-template-columns: auto"])("scrolls inside its own named region in a parent with %s", async (style) => {
		await show(`<div style="${style}"><ycl-data-table>${wide("<caption>Results</caption>")}</ycl-data-table></div>`);
		const el = document.querySelector("ycl-data-table");
		expect(pageOverflow()).toBe(0);
		expect(region(el).scrollWidth).toBeGreaterThan(region(el).clientWidth);
		expect(region(el).tabIndex).toBe(0);
		expect(region(el).getAttribute("role")).toBe("region");
		expect(region(el).getAttribute("aria-label")).toBe("Results");
	});

	it("still searches and sorts inside a flex parent", async () => {
		await show(`<div style="display: flex">${markup}</div>`);
		const el = document.querySelector("ycl-data-table");
		buttons(el)[0].click();
		expect(names(el)).toEqual(["alice", "Bob", "Charlie"]);
		el.query = "tall";
		expect(visible(el)).toEqual(["Bob", "Charlie"]);
		expect(pageOverflow()).toBe(0);
	});
});
