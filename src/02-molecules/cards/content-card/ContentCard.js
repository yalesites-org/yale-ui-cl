import { baseSheet, componentSheet } from "../../../styles/shadow.js";
import componentStyles from "./content-card.css?inline";
import { updateLinkIcon, watchSlot } from "../../../utility.js";

// The heading link is rendered here rather than slotted so its ::after can stretch over the whole
// card (making it clickable) and so it can be dropped when there's no href. The visually hidden
// span gives the overlay text to assistive tech as part of the link name.
const contentCardTemplate = document.createElement("template");
contentCardTemplate.innerHTML = `
	<div class="content-card" data-component-has-image="false">
		<div class="content-card__content">
			<div class="content-card__categories"><slot name="categories"></slot></div>
			<div class="content-card__eyebrow"><slot name="eyebrow"></slot></div>
			<div class="content-card__heading">
				<span class="content-card__prefix"><slot name="prefix"></slot></span>
				<a class="content-card__heading-link"><span class="content-card__overlay-label visually-hidden"></span><slot name="heading"></slot></a>
			</div>
			<div class="content-card__pronouns"><slot name="pronouns"></slot></div>
			<div class="content-card__subheading"><slot name="subheading"></slot></div>
			<div class="content-card__overline"><slot name="overline"></slot></div>
			<div class="content-card__tags"><slot name="tags"></slot></div>
			<div class="content-card__snippet"><slot></slot></div>
			<div class="content-card__ctas"><slot name="ctas"></slot></div>
		</div>
		<div class="content-card__image"><slot name="image"></slot></div>
		<div class="content-card__overlay" aria-hidden="true" hidden></div>
	</div>
`;

/**
 * A card for a post, event, profile or resource. With an href, the whole card is a link.
 * @attr {string} href - URL the card links to.
 * @attr {string} overlay - Text shown over the image, such as "Video". Also added to the link name.
 * @attr {"grid"|"list"|"condensed"|"single"} layout - Card layout. Defaults to grid.
 * @attr {boolean} featured - Larger, featured presentation.
 * @attr {"profile"|"resource"} source - Adjusts the image for profile photos or resource thumbnails.
 * @slot categories - Category links.
 * @slot eyebrow - Text above the heading.
 * @slot prefix - Text before the heading.
 * @slot heading - The card heading.
 * @slot pronouns - Pronouns, for profiles.
 * @slot subheading - Text under the heading.
 * @slot overline - A date or other short line, often a ycl-date-time.
 * @slot tags - Tag links.
 * @slot - Summary text.
 * @slot ctas - Links or buttons.
 * @slot image - The card image.
 */
export class ContentCard extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["href", "overlay"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "content-card")];
		this.#shadow.appendChild(document.importNode(contentCardTemplate.content, true));
		this.card = this.#shadow.querySelector(".content-card");
		this.link = this.#shadow.querySelector(".content-card__heading-link");
		this.overlayLabel = this.#shadow.querySelector(".content-card__overlay-label");
		this.overlayText = this.#shadow.querySelector(".content-card__overlay");

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
			// External and file links get the external/download icon after the title, as YaleSites'
			// link treatment adds to linked card headings.
			updateLinkIcon(this.link.querySelector(".fa-icon"), this.link, window.location.origin);
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

if (!customElements.get("ycl-content-card")) customElements.define("ycl-content-card", ContentCard);
