import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./data-table.css?inline";
import { iconSvg } from "../../01-atoms/icons/icons.js";
import "../../01-atoms/text-input/TextInput.js";
import "../../01-atoms/table/Table.js";

const sortIcons = {
	none: iconSvg("sort"),
	ascending: iconSvg("sort-up"),
	descending: iconSvg("sort-down"),
};

const dataTableTemplate = document.createElement("template");
dataTableTemplate.innerHTML = `
	<div class="data-table">
		<div class="data-table__search">
			<text-input class="data-table__input"><span slot="label">Search</span></text-input>
			<p class="data-table__status" role="status"></p>
		</div>
		<yc-table><slot></slot></yc-table>
	</div>
`;

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });

// "$1,200", "45%" and "-3.5" all count as numbers, so money and percentage columns sort by value.
const toNumber = (text) => {
	const stripped = text.replace(/[$,%\s]/g, "");
	return stripped !== "" && Number.isFinite(Number(stripped)) ? Number(stripped) : NaN;
};

// The cell under a column, counting colspans so the index lines up with the header row.
function cellAt(row, column) {
	let start = 0;
	for (const cell of row.cells) {
		if (column < start + cell.colSpan) return cell;
		start += cell.colSpan;
	}
	return null;
}

const sortKey = (cell) => (cell?.dataset.sortValue ?? cell?.textContent ?? "").trim();

// Enhances a slotted <table>: a search field filters its body rows, and each header in the last
// header row becomes a sort button. The table stays in the light DOM so its markup, caption and
// page styles are the author's; sorting reorders the rows in place and filtering sets [hidden].
// The sorted column is whichever header carries aria-sort, so authors can presort by setting it.
/**
 * Adds search and column sorting to a slotted `<table>`. Set aria-sort on a header to presort; add data-no-sort to a header to make it unsortable; put data-sort-value on a cell to sort by that instead of its text.
 * @attr {string} label - Label for the search field. Defaults to "Search".
 * @attr {string} placeholder - Placeholder for the search field.
 * @slot - A `<table>` with a `<thead>`.
 */
export class DataTable extends HTMLElement {
	#shadow;
	#observer;
	#headers = [];

	static get observedAttributes() {
		return ["label", "placeholder"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "data-table")];
		this.#shadow.appendChild(document.importNode(dataTableTemplate.content, true));
		this.search = this.#shadow.querySelector("text-input");
		this.searchLabel = this.#shadow.querySelector('[slot="label"]');
		this.status = this.#shadow.querySelector(".data-table__status");

		this.search.addEventListener("input", this.refresh);
		this.addEventListener("click", this.clickHandler);
		this.#observer = new MutationObserver(this.refresh);
	}

	connectedCallback() {
		this.#observer.observe(this, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["aria-sort"] });
		this.refresh();
	}

	disconnectedCallback() {
		this.#observer.disconnect();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "label") this.searchLabel.textContent = newValue || "Search";
		if (name === "placeholder") {
			if (newValue === null) this.search.removeAttribute("placeholder");
			else this.search.placeholder = newValue;
		}
	}

	get label() { return this.getAttribute("label"); }
	set label(value) { this.setAttribute("label", value); }

	get placeholder() { return this.getAttribute("placeholder"); }
	set placeholder(value) { this.setAttribute("placeholder", value); }

	/** The search text. Setting it filters the rows. */
	get query() { return this.search.value ?? ""; }
	set query(value) {
		this.search.value = value;
		this.refresh();
	}

	get table() {
		return this.querySelector(":scope > table");
	}

	// Re-applies headers, sort and filter from scratch, so it's safe to call after any change to the
	// table. Our own DOM writes would re-trigger the observer forever, so their records are dropped.
	/** Re-applies sorting and filtering. Call it after changing the table's rows. */
	refresh = () => {
		this.#enhanceHeaders();
		this.#sort();
		this.#filter();
		this.#observer.takeRecords();
	};

	// Ascending first, then toggles. Only one column is sorted at a time.
	clickHandler = (event) => {
		const header = this.#headers.find((h) => h.button.contains(event.target));
		if (!header) return;
		const direction = header.th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
		this.#headers.forEach((h) => h.th.removeAttribute("aria-sort"));
		header.th.setAttribute("aria-sort", direction);
		this.refresh();
	};

	#enhanceHeaders() {
		const head = this.table?.tHead;
		const row = head?.rows[head.rows.length - 1];
		this.#headers = [];
		let column = 0;
		for (const th of row?.cells ?? []) {
			const index = column;
			column += th.colSpan;
			if (th.localName !== "th" || th.hasAttribute("data-no-sort")) continue;

			let button = th.querySelector(":scope > .data-table__sort");
			if (!button) {
				button = document.createElement("button");
				button.type = "button";
				button.className = "data-table__sort";
				const label = document.createElement("span");
				label.className = "data-table__sort-label";
				label.append(...th.childNodes);
				const icon = document.createElement("span");
				icon.className = "data-table__sort-icon";
				button.append(label, icon);
				th.append(button);
			}
			this.#headers.push({ th, button, column: index });
		}
	}

	#sort() {
		const sorted = this.#headers.find((h) => ["ascending", "descending"].includes(h.th.getAttribute("aria-sort")));
		this.#headers.forEach((h) => {
			const state = h === sorted ? h.th.getAttribute("aria-sort") : "none";
			const icon = h.button.querySelector(".data-table__sort-icon");
			if (icon.dataset.state !== state) {
				icon.dataset.state = state;
				icon.innerHTML = sortIcons[state];
			}
		});
		if (!sorted) return;

		const bodies = [...this.table.tBodies];
		const keys = new Map(bodies.flatMap((body) => [...body.rows]).map((row) => [row, sortKey(cellAt(row, sorted.column))]));
		const type = sorted.th.dataset.sortType;
		const numeric = type === "number" || (!type && [...keys.values()].every((key) => key === "" || !Number.isNaN(toNumber(key))));
		const direction = sorted.th.getAttribute("aria-sort") === "ascending" ? 1 : -1;

		const compare = (a, b) => {
			const [keyA, keyB] = [keys.get(a), keys.get(b)];
			// Blank cells stay at the bottom whichever way the column is sorted.
			if (keyA === "" || keyB === "") return (keyA === "") - (keyB === "");
			return direction * (numeric ? toNumber(keyA) - toNumber(keyB) : collator.compare(keyA, keyB));
		};

		bodies.forEach((body) => {
			const rows = [...body.rows];
			const ordered = rows.toSorted(compare);
			// Leave the DOM alone when nothing moves, so focus inside a row isn't lost for nothing.
			if (ordered.some((row, i) => row !== rows[i])) body.append(...ordered);
		});
	}

	// A row matches when its text contains every word of the query, in any order or case.
	#filter() {
		const terms = this.query.toLowerCase().split(/\s+/).filter(Boolean);
		const rows = [...(this.table?.tBodies ?? [])].flatMap((body) => [...body.rows]);
		let shown = 0;
		rows.forEach((row) => {
			const text = row.textContent.toLowerCase();
			const match = terms.every((term) => text.includes(term));
			if (row.hidden === match) row.hidden = !match;
			if (match) shown++;
		});

		let message = "";
		if (terms.length) message = shown ? `Showing ${shown} of ${rows.length} rows` : "No rows match your search";
		if (this.status.textContent !== message) this.status.textContent = message;
	}
}

if (!customElements.get("ycl-data-table")) customElements.define("ycl-data-table", DataTable);
