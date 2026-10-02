import baseStyles from "../../styles/base.css?inline";
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

const contentSpotlightPortraitTemplate = document.createElement("template");
contentSpotlightPortraitTemplate.innerHTML = `
	<div class="content-spotlight-portrait">
		<div class="content-spotlight-portrait__inner">
			<div class="content-spotlight-portrait__content">
				<div class="content-spotlight-portrait__overline"><slot name="overline"></slot></div>
				<div class="content-spotlight-portrait__heading"><slot name="heading"></slot></div>
				<div class="content-spotlight-portrait__subheading"><slot name="subheading"></slot></div>
				<div class="content-spotlight-portrait__text"><slot></slot></div>
				<div class="content-spotlight-portrait__ctas"><slot name="ctas"></slot></div>
			</div>
			<div class="content-spotlight-portrait__image">
				<figure class="figure">
					<slot name="image"></slot>
					<figcaption class="caption content-spotlight-portrait__caption"><slot name="caption"></slot></figcaption>
				</figure>
			</div>
		</div>
	</div>
`;

export class ContentSpotlightPortrait extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(contentSpotlightPortraitTemplate.content, true));

		// Empty optional parts are hidden so they don't leave stray spacing.
		this.#shadow.querySelectorAll("slot:not([name='image'])").forEach((slot) => {
			watchSlot(slot, (filled) => { slot.parentElement.hidden = !filled; });
		});
	}

	get theme() { return this.getAttribute("theme") ?? "default"; }
	set theme(value) { this.setAttribute("theme", value); }

	get position() { return this.getAttribute("position") ?? "image-left"; }
	set position(value) { this.setAttribute("position", value); }
}

customElements.define("ycl-content-spotlight-portrait", ContentSpotlightPortrait);
