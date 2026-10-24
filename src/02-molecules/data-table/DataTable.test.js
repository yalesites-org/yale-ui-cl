import { describe, expect, it } from "vitest";
import "./DataTable.js";
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
});
