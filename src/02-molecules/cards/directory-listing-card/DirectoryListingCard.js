import baseStyles from "../../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

// Runs onChange(filled) whenever a slot gains or loses content. Whitespace-only text doesn't count.
const watchSlot = (slot, onChange) => {
	const update = () => onChange(slot.assignedNodes({ flatten: true }).some(
		(node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim() !== ""
	));
	slot.addEventListener("slotchange", update);
	update();
};

// Unlike the reference card, only the heading is a link here: the email link must stay
// separately clickable. The link is rendered here so it can be dropped when there's no href.
const directoryListingCardTemplate = document.createElement("template");
directoryListingCardTemplate.innerHTML = `
	<div class="directory-listing-card">
		<div class="directory-listing-card__content">
			<div class="directory-listing-card__overline"><slot name="overline"></slot></div>
			<div class="directory-listing-card__heading"><a class="directory-listing-card__heading-link"><slot name="heading"></slot></a></div>
			<div class="directory-listing-card__subheading"><slot name="subheading"></slot></div>
			<div class="directory-listing-card__snippet"><slot></slot></div>
			<div class="directory-listing-card__email"><slot name="email"></slot></div>
			<div class="directory-listing-card__phone"><slot name="phone"></slot></div>
		</div>
		<div class="directory-listing-card__image"><slot name="image"></slot></div>
	</div>
`;

export class DirectoryListingCard extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["href"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(directoryListingCardTemplate.content, true));
		this.link = this.#shadow.querySelector(".directory-listing-card__heading-link");

		this.#shadow.querySelectorAll("slot:not([name='heading'])").forEach((slot) => {
			watchSlot(slot, (filled) => { slot.parentElement.hidden = !filled; });
		});
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "href") {
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

customElements.define("ycl-directory-listing-card", DirectoryListingCard);
