import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./tiles.css?inline";
import "./TileItem.js";
import { forwardAttribute, forwardAttributes } from "../../utility.js";

const tilesTemplate = document.createElement("template");
tilesTemplate.innerHTML = `
	<div class="tiles">
		<ul class="tiles__items" role="list"></ul>
	</div>
`;

// The Tiles organism: a responsive grid of ycl-tile-item children. Slots are assigned by hand so
// every tile gets its own <li>, giving assistive tech real list markup (named slots can only
// project into a single place). role="list" keeps the semantics in Safari, which drops them from
// lists styled with list-style: none. alignment, vertical-alignment and presentation set on the
// group are copied onto every tile, over the tile's own; theme, href, animated and image stay per tile.
const forwarded = ["alignment", "vertical-alignment", "presentation"];

export class Tiles extends HTMLElement {
	#shadow;
	#observer;

	static get observedAttributes() {
		return forwarded;
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed", slotAssignment: "manual" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "tiles")];
		this.#shadow.appendChild(document.importNode(tilesTemplate.content, true));
		// Only direct children matter; changes inside a tile don't need a re-render.
		this.#observer = new MutationObserver(() => this.#render());
	}

	connectedCallback() {
		this.#observer.observe(this, { childList: true });
		this.#render();
	}

	disconnectedCallback() {
		this.#observer.disconnect();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		// A group option that's removed is removed from the tiles too; one never set leaves theirs alone.
		forwardAttribute(this.#tiles(), name, newValue);
	}

	#tiles() {
		// Only tiles are listed, so a stray element (a <template>, a wrapper) doesn't get an empty cell.
		return [...this.children].filter((child) => child.localName === "ycl-tile-item");
	}

	#render() {
		const tiles = this.#tiles();
		forwardAttributes(this, forwarded, tiles);
		const list = this.#shadow.querySelector(".tiles__items");
		const slots = tiles.map(() => document.createElement("slot"));
		list.replaceChildren(...slots.map((slot) => {
			const item = document.createElement("li");
			item.className = "tiles__item";
			item.appendChild(slot);
			return item;
		}));
		// Assign once the slots are in the shadow root, rather than relying on assignment surviving insertion.
		slots.forEach((slot, i) => slot.assign(tiles[i]));
	}

	get alignment() { return this.getAttribute("alignment"); }
	set alignment(value) { this.setAttribute("alignment", value); }

	get verticalAlignment() { return this.getAttribute("vertical-alignment"); }
	set verticalAlignment(value) { this.setAttribute("vertical-alignment", value); }

	get presentation() { return this.getAttribute("presentation"); }
	set presentation(value) { this.setAttribute("presentation", value); }
}

if (!customElements.get("ycl-tiles")) customElements.define("ycl-tiles", Tiles);
