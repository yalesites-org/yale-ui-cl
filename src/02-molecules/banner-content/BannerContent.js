import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./banner-content.css?inline";

const PLACEMENTS = ["contained", "full"];

const bannerContentTemplate = document.createElement("template");
bannerContentTemplate.innerHTML = `
	<div class="banner-content">
		<div class="banner-content__inner">
			<div class="banner-content__text">
				<div class="banner-content__heading"><slot name="heading"></slot></div>
				<div class="banner-content__snippet"><slot></slot></div>
			</div>
			<div class="banner-content__actions" hidden><slot name="actions"></slot></div>
		</div>
	</div>
`;

/**
 * The heading, text and actions that sit on top of a banner. Banners compose this instead of
 * each carrying their own copy.
 * @attr {"primary"|"secondary"|"tertiary"|"accent-1"|"accent-2"} theme - Color option, from the page palette. Defaults to primary.
 * @attr {"contained"|"full"} placement - contained keeps the content in a box of its own width, as when it overlays part of a banner; full lets it span the whole banner width. Defaults to contained.
 * @attr {"left"|"center"|"right"} button-alignment - Alignment of the actions. Defaults to left.
 * @slot heading - The heading, such as a ycl-heading.
 * @slot - The text.
 * @slot actions - Links or buttons, such as ycl-cta-link elements.
 */
export class BannerContent extends HTMLElement {
	#shadow;
	#root;
	#actions;

	static get observedAttributes() {
		return ["theme", "placement", "button-alignment"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "banner-content")];
		this.#shadow.appendChild(document.importNode(bannerContentTemplate.content, true));
		this.#root = this.#shadow.querySelector(".banner-content");
		this.#actions = this.#shadow.querySelector(".banner-content__actions");
		const actionsSlot = this.#shadow.querySelector('slot[name="actions"]');
		// An empty actions area would still take up a flex gap.
		actionsSlot.addEventListener("slotchange", () => {
			this.#actions.hidden = actionsSlot.assignedElements().length === 0;
		});
		this.#render();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this.#render();
	}

	#render() {
		const placement = this.getAttribute("placement");
		this.#root.dataset.componentTheme = this.getAttribute("theme") || "primary";
		this.#root.dataset.bannerPlacement = PLACEMENTS.includes(placement) ? placement : "contained";
		this.#actions.dataset.buttonAlignment = this.getAttribute("button-alignment") || "left";
	}
}

if (!customElements.get("ycl-banner-content")) customElements.define("ycl-banner-content", BannerContent);
