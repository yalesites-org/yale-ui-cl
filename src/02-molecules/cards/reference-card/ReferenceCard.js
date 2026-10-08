import { baseSheet, componentSheet } from "../../../styles/shadow.js";
import componentStyles from "./reference-card.css?inline";

// Runs onChange(filled) whenever a slot gains or loses content, so empty optional parts can be
// hidden instead of leaving stray spacing. Whitespace-only text doesn't count as content.
const watchSlot = (slot, onChange) => {
	const update = () => onChange(slot.assignedNodes({ flatten: true }).some(
		(node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim() !== ""
	));
	slot.addEventListener("slotchange", update);
	update();
};

// The heading link is rendered here rather than slotted so its ::after can stretch over the whole
// card (making it clickable) and so it can be dropped when there's no href. The visually hidden
// span gives the overlay text to assistive tech as part of the link name.
const referenceCardTemplate = document.createElement("template");
referenceCardTemplate.innerHTML = `
	<div class="reference-card" data-component-has-image="false">
		<div class="reference-card__content">
			<div class="reference-card__categories"><slot name="categories"></slot></div>
			<div class="reference-card__eyebrow"><slot name="eyebrow"></slot></div>
			<div class="reference-card__heading">
				<span class="reference-card__prefix"><slot name="prefix"></slot></span>
				<a class="reference-card__heading-link"><span class="reference-card__overlay-label visually-hidden"></span><slot name="heading"></slot></a>
			</div>
			<div class="reference-card__pronouns"><slot name="pronouns"></slot></div>
			<div class="reference-card__subheading"><slot name="subheading"></slot></div>
			<div class="reference-card__overline"><slot name="overline"></slot></div>
			<div class="reference-card__tags"><slot name="tags"></slot></div>
			<div class="reference-card__snippet"><slot></slot></div>
			<div class="reference-card__ctas"><slot name="ctas"></slot></div>
		</div>
		<div class="reference-card__image"><slot name="image"></slot></div>
		<div class="reference-card__overlay" aria-hidden="true" hidden></div>
	</div>
`;

export class ReferenceCard extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["href", "overlay"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "reference-card")];
		this.#shadow.appendChild(document.importNode(referenceCardTemplate.content, true));
		this.card = this.#shadow.querySelector(".reference-card");
		this.link = this.#shadow.querySelector(".reference-card__heading-link");
		this.overlayLabel = this.#shadow.querySelector(".reference-card__overlay-label");
		this.overlayText = this.#shadow.querySelector(".reference-card__overlay");

		this.#shadow.querySelectorAll("slot").forEach((slot) => {
			// The heading slot sits inside the link; its wrapper always renders.
			if (slot.name === "heading") return;
			const wrapper = slot.parentElement;
			watchSlot(slot, (filled) => {
				wrapper.hidden = !filled;
				if (slot.name === "image") this.card.dataset.componentHasImage = String(filled);
			});
		});
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "href") {
			// An <a> without href isn't a link, so a card with no URL simply isn't clickable.
			if (newValue === null) this.link.removeAttribute("href");
			else this.link.setAttribute("href", newValue);
		}
		if (name === "overlay") {
			this.overlayText.textContent = newValue ?? "";
			this.overlayText.hidden = !newValue;
			this.overlayLabel.textContent = newValue ? `${newValue}: ` : "";
		}
	}

	get href() { return this.getAttribute("href"); }
	set href(value) { this.setAttribute("href", value); }

	get overlay() { return this.getAttribute("overlay"); }
	set overlay(value) { this.setAttribute("overlay", value); }

	get layout() { return this.getAttribute("layout") ?? "grid"; }
	set layout(value) { this.setAttribute("layout", value); }

	get featured() { return this.hasAttribute("featured"); }
	set featured(value) {
		if (value) this.setAttribute("featured", "");
		else this.removeAttribute("featured");
	}
}

if (!customElements.get("ycl-reference-card")) customElements.define("ycl-reference-card", ReferenceCard);
