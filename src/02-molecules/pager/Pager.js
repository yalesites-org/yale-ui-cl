import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./pager.css?inline";

// Font Awesome Free "angle-down" (CC BY 4.0), decorative only; rotated in CSS to point sideways.
const angleDownIcon = (className) => `<svg class="${className}" viewBox="0 0 448 512" aria-hidden="true" focusable="false"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>`;

const pagerTemplate = document.createElement("template");
pagerTemplate.innerHTML = `
	<nav class="pager" aria-label="Pagination" hidden>
		<ul class="pager__items"></ul>
	</nav>
`;

const range = (first, last) => Array.from({ length: last - first + 1 }, (_, i) => first + i);

// The page numbers to show, with null where an ellipsis goes. Five or more pages always keep the
// first and last page plus the current page's neighbourhood; pages 3 and third-from-last show one
// extra neighbour so the next step is always a single click away.
function pagerPages(current, total) {
	if (total <= 4) return range(1, total);

	let pages;
	if (current <= 2) pages = [...range(1, 3), total];
	else if (current === 3) pages = [...range(1, 4), total];
	else if (current >= total - 1) pages = [1, ...range(total - 2, total)];
	else if (current === total - 2) pages = [1, ...range(total - 3, total)];
	else pages = [1, ...range(current - 1, current + 1), total];

	// Only mark a gap where pages are actually skipped (the Twig shows "1 2 3 4 ... 5" otherwise).
	return pages.flatMap((page, i) => (i > 0 && page - pages[i - 1] > 1 ? [null, page] : [page]));
}

export class Pager extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["current", "total-pages", "base-url", "label"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "pager")];
		this.#shadow.appendChild(document.importNode(pagerTemplate.content, true));
		this.nav = this.#shadow.querySelector(".pager");
		this.list = this.#shadow.querySelector(".pager__items");
		this.list.addEventListener("click", this.clickHandler);
	}

	connectedCallback() {
		this.#render();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "label") this.nav.setAttribute("aria-label", newValue || "Pagination");
		else if (this.isConnected) this.#render();
	}

	// Fires a cancelable "ycl-page-change" so script-driven pages can handle paging themselves.
	clickHandler = (event) => {
		const link = event.target.closest("a[data-page]");
		if (!link) return;
		const pageChange = new CustomEvent("ycl-page-change", {
			bubbles: true,
			composed: true,
			cancelable: true,
			detail: { page: Number(link.dataset.page) },
		});
		if (!this.dispatchEvent(pageChange)) event.preventDefault();
	};

	get totalPages() { return Math.max(1, Math.floor(Number(this.getAttribute("total-pages")) || 1)); }
	set totalPages(value) { this.setAttribute("total-pages", value); }

	get current() {
		const current = Math.floor(Number(this.getAttribute("current")) || 1);
		return Math.min(Math.max(current, 1), this.totalPages);
	}
	set current(value) { this.setAttribute("current", value); }

	get baseUrl() { return this.getAttribute("base-url") ?? ""; }
	set baseUrl(value) { this.setAttribute("base-url", value); }

	#href(page) {
		const url = new URL(this.baseUrl, document.baseURI);
		url.searchParams.set("page", page);
		return url.href;
	}

	#link(page, className, content) {
		const link = document.createElement("a");
		link.className = className;
		link.href = this.#href(page);
		link.dataset.page = page;
		link.innerHTML = content;
		return link;
	}

	#item(modifier, child) {
		const item = document.createElement("li");
		item.className = `pager__item pager__item--${modifier}`;
		item.append(child);
		return item;
	}

	#render() {
		const total = this.totalPages;
		const current = this.current;
		// A single page needs no pager at all.
		this.nav.hidden = total <= 1;
		if (total <= 1) {
			this.list.replaceChildren();
			return;
		}

		const items = [];
		if (current > 1) {
			const previous = this.#link(current - 1, "pager__link pager__link--previous", `<span class="visually-hidden">Previous</span>${angleDownIcon("pager__icon pager__icon--previous")}`);
			previous.rel = "prev";
			previous.title = "Go to previous page";
			items.push(this.#item("previous", previous));
		}

		pagerPages(current, total).forEach((page) => {
			if (page === null) {
				const ellipsis = document.createElement("span");
				ellipsis.className = "pager__ellipsis";
				ellipsis.textContent = "...";
				// Hidden at the item level so screen readers don't count an empty list item.
				const item = this.#item("ellipsis", ellipsis);
				item.setAttribute("aria-hidden", "true");
				items.push(item);
			} else if (page === current) {
				const currentPage = document.createElement("span");
				currentPage.className = "pager__link pager__link--current is-active";
				currentPage.innerHTML = `<span class="visually-hidden">Current</span> ${page}`;
				items.push(this.#item("desktop", currentPage));
			} else {
				const link = this.#link(page, "pager__link", String(page));
				link.setAttribute("aria-label", `Go to ${page}`);
				items.push(this.#item("desktop", link));
			}
		});

		// Narrow screens show a compact "3 / 10" in place of the page numbers.
		items.push(this.#item("mobile", `${current} / ${total}`));

		if (current < total) {
			const next = this.#link(current + 1, "pager__link pager__link--next", `<span class="visually-hidden">Next</span>${angleDownIcon("pager__icon pager__icon--next")}`);
			next.rel = "next";
			next.title = "Go to next page";
			items.push(this.#item("next", next));
		}

		// When paging in place (see ycl-page-change), keep focus on the arrow that was used.
		const focused = this.#shadow.activeElement;
		const arrow = ["pager__link--previous", "pager__link--next"].find((c) => focused?.classList.contains(c));
		this.list.replaceChildren(...items);
		if (arrow) this.list.querySelector(`.${arrow}`)?.focus();
	}
}

if (!customElements.get("ycl-pager")) customElements.define("ycl-pager", Pager);
