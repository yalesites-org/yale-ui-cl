import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./card-collection.css?inline";
import { hasContent } from "../../utility.js";
import "../../02-molecules/section-header/SectionHeader.js";

// The header slots are forwarded into ycl-section-header, which hides each empty part itself.
const cardCollectionTemplate = document.createElement("template");
cardCollectionTemplate.innerHTML = `
	<div class="card-collection">
		<ycl-section-header class="card-collection__header" hidden>
			<slot name="heading"></slot>
			<slot name="text" slot="text"></slot>
			<slot name="link" slot="link"></slot>
		</ycl-section-header>
		<div class="card-collection__cards"><slot></slot></div>
	</div>
`;

/**
 * A grid or list of cards with an optional heading, intro and "view all" link.
 * Put ycl-content-card or ycl-custom-card elements directly inside. Content cards without their own
 * layout attribute are given the collection's layout, so they match it.
 * @attr {"grid"|"list"} layout - Grid of up to three columns, or a single-column list. Defaults to grid.
 * @attr {"1"|"2"|"3"|"4"|"5"|"6"} level - Heading level, to fit the page outline. Defaults to 2.
 * @attr {string} link-href - URL of the "view all" link.
 * @slot - The cards.
 * @slot heading - The heading text.
 * @slot text - Intro text under the heading.
 * @slot link - The link text, for example "View all".
 */
export class CardCollection extends HTMLElement {
	#shadow;
	// The layout the collection last wrote on each card, so it never overwrites one the author chose.
	#written = new WeakMap();

	static get observedAttributes() {
		return ["layout", "level", "link-href"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "card-collection")];
		this.#shadow.appendChild(document.importNode(cardCollectionTemplate.content, true));
		this.header = this.#shadow.querySelector(".card-collection__header");
		this.headerSlots = [...this.header.querySelectorAll("slot")];
		this.cardSlot = this.#shadow.querySelector(".card-collection__cards slot");

		for (const slot of this.headerSlots) slot.addEventListener("slotchange", () => this.#renderHeader());
		this.cardSlot.addEventListener("slotchange", () => this.#syncCardLayouts());
		this.#renderHeader();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "layout") {
			this.#syncCardLayouts();
			return;
		}
		if (newValue === null) this.header.removeAttribute(name);
		else this.header.setAttribute(name, newValue);
	}

	#renderHeader() {
		this.header.hidden = !this.headerSlots.some(hasContent);
	}

	#syncCardLayouts() {
		const layout = this.layout;
		for (const card of this.cardSlot.assignedElements()) {
			if (card.localName !== "ycl-content-card") continue;
			const current = card.getAttribute("layout");
			if (current !== null && current !== this.#written.get(card)) continue;
			this.#written.set(card, layout);
			if (current !== layout) card.setAttribute("layout", layout);
		}
	}

	// Anything other than "list" is a grid, as in the CSS.
	get layout() { return this.getAttribute("layout") === "list" ? "list" : "grid"; }
	set layout(value) { this.setAttribute("layout", value); }

	get level() { return this.getAttribute("level"); }
	set level(value) {
		if (value) this.setAttribute("level", value);
		else this.removeAttribute("level");
	}

	get linkHref() { return this.getAttribute("link-href"); }
	set linkHref(value) {
		if (value) this.setAttribute("link-href", value);
		else this.removeAttribute("link-href");
	}
}

if (!customElements.get("ycl-card-collection")) customElements.define("ycl-card-collection", CardCollection);
