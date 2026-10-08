import { baseSheet, componentSheet } from "../../../styles/shadow.js";
import componentStyles from "./custom-card.css?inline";

// Runs onChange(filled) whenever a slot gains or loses content. Whitespace-only text doesn't count.
const watchSlot = (slot, onChange) => {
	const update = () => onChange(slot.assignedNodes({ flatten: true }).some(
		(node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim() !== ""
	));
	slot.addEventListener("slotchange", update);
	update();
};

// The heading link is rendered here rather than slotted so its ::after can stretch over the whole
// card, making it clickable, and so it can be dropped when there's no href.
// The image wrapper always renders: without an image it becomes the decorative colour bar.
const customCardTemplate = document.createElement("template");
customCardTemplate.innerHTML = `
	<div class="custom-card" data-with-image="false">
		<div class="custom-card__content">
			<div class="custom-card__heading"><a class="custom-card__heading-link"><slot name="heading"></slot></a></div>
			<div class="custom-card__snippet"><slot></slot></div>
		</div>
		<div class="custom-card__image"><slot name="image"></slot></div>
	</div>
`;

export class CustomCard extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["href"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "custom-card")];
		this.#shadow.appendChild(document.importNode(customCardTemplate.content, true));
		this.card = this.#shadow.querySelector(".custom-card");
		this.link = this.#shadow.querySelector(".custom-card__heading-link");

		const snippetSlot = this.#shadow.querySelector(".custom-card__snippet slot");
		watchSlot(snippetSlot, (filled) => { snippetSlot.parentElement.hidden = !filled; });
		watchSlot(this.#shadow.querySelector('slot[name="image"]'), (filled) => {
			this.card.dataset.withImage = String(filled);
		});
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "href") {
			// An <a> without href isn't a link, so a card with no URL simply isn't clickable.
			if (newValue === null) this.link.removeAttribute("href");
			else this.link.setAttribute("href", newValue);
		}
	}

	get href() { return this.getAttribute("href"); }
	set href(value) { this.setAttribute("href", value); }

	get featured() { return this.hasAttribute("featured"); }
	set featured(value) {
		if (value) this.setAttribute("featured", "");
		else this.removeAttribute("featured");
	}
}

if (!customElements.get("ycl-custom-card")) customElements.define("ycl-custom-card", CustomCard);
