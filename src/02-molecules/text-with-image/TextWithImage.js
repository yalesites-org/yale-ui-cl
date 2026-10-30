import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./text-with-image.css?inline";

// Runs onChange(filled) whenever a slot gains or loses content. Whitespace-only text doesn't count.
const watchSlot = (slot, onChange) => {
	const update = () => onChange(slot.assignedNodes({ flatten: true }).some(
		(node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim() !== ""
	));
	slot.addEventListener("slotchange", update);
	update();
};

const textWithImageTemplate = document.createElement("template");
textWithImageTemplate.innerHTML = `
	<div class="text-with-image">
		<div class="text-with-image__inner">
			<div class="text-with-image__content">
				<div class="text-with-image__overline"><slot name="overline"></slot></div>
				<div class="text-with-image__heading"><slot name="heading"></slot></div>
				<div class="text-with-image__subheading"><slot name="subheading"></slot></div>
				<div class="text-with-image__text"><slot></slot></div>
				<div class="text-with-image__ctas"><slot name="ctas"></slot></div>
			</div>
			<div class="text-with-image__image">
				<figure class="figure">
					<slot name="image"></slot>
					<figcaption class="caption text-with-image__caption"><slot name="caption"></slot></figcaption>
				</figure>
			</div>
		</div>
	</div>
`;

/**
 * Text beside an image.
 * @attr {"default"|"one"|"two"|"three"|"four"|"five"|"six"} theme - Color theme. Defaults to default.
 * @attr {"site"|"highlight"} width - Width of the component. Defaults to site.
 * @attr {"image-left"|"image-right"} position - Which side the image is on. Defaults to image-left.
 * @attr {"top"|"middle"|"bottom"} vertical-align - Vertical alignment of the text. Defaults to top.
 * @attr {"inline"|"offset"} image-style - offset shifts the image off the background. Defaults to inline.
 * @attr {"equal"|"image"|"content"} focus - Which side gets more width. Defaults to equal.
 * @slot overline - Text above the heading.
 * @slot heading - The heading.
 * @slot subheading - Text under the heading.
 * @slot - The text.
 * @slot ctas - Links or buttons.
 * @slot image - The image.
 * @slot caption - The image caption.
 */
export class TextWithImage extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "text-with-image")];
		this.#shadow.appendChild(document.importNode(textWithImageTemplate.content, true));

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

if (!customElements.get("ycl-text-with-image")) customElements.define("ycl-text-with-image", TextWithImage);
