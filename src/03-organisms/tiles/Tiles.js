import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./tiles.css?inline";
import "./TileItem.js";

const tilesTemplate = document.createElement("template");
tilesTemplate.innerHTML = `
	<div class="tiles">
		<ul class="tiles__items" role="list"></ul>
	</div>
`;

// The Tiles organism: a responsive grid of ycl-tile-item children. Slots are assigned by hand so
// every tile gets its own <li>, giving assistive tech real list markup (named slots can only
// project into a single place). role="list" keeps the semantics in Safari, which drops them from
// lists styled with list-style: none. Options (theme, alignment, href, ...) stay on each
// ycl-tile-item; the group doesn't forward them, so tiles in one group can differ.
export class Tiles extends HTMLElement {
	#shadow;
	#observer;

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

	#render() {
		// Only tiles are listed, so a stray element (a <template>, a wrapper) doesn't get an empty cell.
		const tiles = [...this.children].filter((child) => child.localName === "ycl-tile-item");
		const list = this.#shadow.querySelector(".tiles__items");
		list.replaceChildren(...tiles.map((tile) => {
			const item = document.createElement("li");
			item.className = "tiles__item";
			item.appendChild(document.createElement("slot")).assign(tile);
			return item;
		}));
	}
}

if (!customElements.get("ycl-tiles")) customElements.define("ycl-tiles", Tiles);
