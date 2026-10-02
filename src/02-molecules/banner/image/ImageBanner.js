import baseStyles from "../../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const imageBannerTemplate = document.createElement("template");
imageBannerTemplate.innerHTML = `
	<div class="image-banner">
		<figure class="image-banner__image">
			<slot></slot>
			<figcaption class="image-banner__caption" hidden><slot name="caption"></slot></figcaption>
		</figure>
	</div>
`;

export class ImageBanner extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(imageBannerTemplate.content, true));
		const caption = this.#shadow.querySelector(".image-banner__caption");
		const captionSlot = this.#shadow.querySelector('slot[name="caption"]');
		// An empty caption would still draw its white bar over the image.
		captionSlot.addEventListener("slotchange", () => {
			caption.hidden = captionSlot.assignedNodes().length === 0;
		});
	}
}

customElements.define("ycl-image-banner", ImageBanner);
