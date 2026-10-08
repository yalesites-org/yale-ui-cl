import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./tile-item.css?inline";

// Runs onChange(filled) whenever a slot gains or loses content. Whitespace-only text doesn't count.
const watchSlot = (slot, onChange) => {
	const update = () => onChange(slot.assignedNodes({ flatten: true }).some(
		(node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim() !== ""
	));
	slot.addEventListener("slotchange", update);
	update();
};

// The Twig presentation styles (heading, icon, text-only) fall out of what's slotted: the icon
// and heading wrappers hide themselves when empty. With an href the content becomes a link whose
// ::after stretches over the tile, making the whole tile clickable.
const tileItemTemplate = document.createElement("template");
tileItemTemplate.innerHTML = `
	<div class="tile__item" data-component-has-image="false">
		<div class="tile__item__inner">
			<div class="tile__item__icon"><slot name="icon"></slot></div>
			<div class="tile__item__heading"><slot name="heading"></slot></div>
			<a class="tile__item__content"><slot></slot></a>
			<div class="tile__item__image"><slot name="image"></slot></div>
		</div>
	</div>
`;

export class TileItem extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["href"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "tile-item")];
		this.#shadow.appendChild(document.importNode(tileItemTemplate.content, true));
		this.tile = this.#shadow.querySelector(".tile__item");
		this.content = this.#shadow.querySelector(".tile__item__content");

		this.#shadow.querySelectorAll("slot").forEach((slot) => {
			watchSlot(slot, (filled) => {
				slot.parentElement.hidden = !filled;
				if (slot.name === "image") this.tile.dataset.componentHasImage = String(filled);
			});
		});
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "href") {
			// An <a> without href isn't a link, so the content renders as plain text.
			this.content.classList.toggle("tile__item__link", newValue !== null);
			if (newValue === null) this.content.removeAttribute("href");
			else this.content.setAttribute("href", newValue);
		}
	}

	get href() { return this.getAttribute("href"); }
	set href(value) { this.setAttribute("href", value); }

	get theme() { return this.getAttribute("theme") ?? "one"; }
	set theme(value) { this.setAttribute("theme", value); }

	get animated() { return this.hasAttribute("animated"); }
	set animated(value) {
		if (value) this.setAttribute("animated", "");
		else this.removeAttribute("animated");
	}
}

if (!customElements.get("ycl-tile-item")) customElements.define("ycl-tile-item", TileItem);
