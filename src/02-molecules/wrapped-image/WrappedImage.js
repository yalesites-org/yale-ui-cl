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

// The image floats inside the same block formatting context as the text, so the slotted
// paragraphs wrap around it just as they do in the Twig markup.
const wrappedImageTemplate = document.createElement("template");
wrappedImageTemplate.innerHTML = `
	<div class="wrapped-image">
		<div class="wrapped-image__inner">
			<div class="wrapped-image__content-wrapper">
				<div class="wrapped-image__image">
					<figure class="figure">
						<slot name="image"></slot>
						<figcaption class="caption wrapped-image__caption"><slot name="caption"></slot></figcaption>
					</figure>
				</div>
				<div class="wrapped-image__text"><slot></slot></div>
			</div>
		</div>
	</div>
`;

export class WrappedImage extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(wrappedImageTemplate.content, true));

		const captionSlot = this.#shadow.querySelector('slot[name="caption"]');
		watchSlot(captionSlot, (filled) => { captionSlot.parentElement.hidden = !filled; });
	}

	get alignment() { return this.getAttribute("alignment") ?? "left"; }
	set alignment(value) { this.setAttribute("alignment", value); }

	get imageStyle() { return this.getAttribute("image-style") ?? "floated"; }
	set imageStyle(value) { this.setAttribute("image-style", value); }
}

customElements.define("ycl-wrapped-image", WrappedImage);
