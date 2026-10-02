import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

// The image (an <img>, <picture> or ycl-image) goes in the default slot, the caption in "caption".
const imageBlockTemplate = document.createElement("template");
imageBlockTemplate.innerHTML = `
	<div class="content-image">
		<div class="content-image__inner">
			<figure class="figure" role="none">
				<slot></slot>
				<figcaption class="caption" hidden><slot name="caption"></slot></figcaption>
			</figure>
		</div>
	</div>
`;

export class ImageBlock extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(imageBlockTemplate.content, true));
		const figure = this.#shadow.querySelector("figure");
		const caption = this.#shadow.querySelector("figcaption");
		const captionSlot = this.#shadow.querySelector('slot[name="caption"]');

		// The Twig version only renders a <figure> when there's a caption; without one it's just the
		// image, so the figure is presentational until a caption is slotted. slotchange never fires
		// for a slot that stays empty, hence the captionless starting state.
		captionSlot.addEventListener("slotchange", () => {
			const hasCaption = captionSlot.assignedNodes().length > 0;
			caption.hidden = !hasCaption;
			if (hasCaption) figure.removeAttribute("role");
			else figure.setAttribute("role", "none");
		});
	}
}

customElements.define("ycl-image-block", ImageBlock);
