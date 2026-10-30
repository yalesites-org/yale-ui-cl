import { baseSheet, componentSheet } from "../../../styles/shadow.js";
import componentStyles from "./image-banner.css?inline";

const imageBannerTemplate = document.createElement("template");
imageBannerTemplate.innerHTML = `
	<div class="image-banner">
		<figure class="image-banner__image">
			<slot></slot>
			<figcaption class="image-banner__caption" hidden><slot name="caption"></slot></figcaption>
		</figure>
	</div>
`;

/**
 * A large image banner with an optional caption.
 * @attr {"one"|"two"|"three"|"four"|"five"|"six"} theme - Color theme of the caption.
 * @attr {"tall"|"short"|"mini"} size - Banner height. Defaults to tall.
 * @attr {"site"|"full"} width - Site width or full browser width. Defaults to site.
 * @slot - The `<img>` or `<picture>`.
 * @slot caption - The caption.
 */
export class ImageBanner extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "image-banner")];
		this.#shadow.appendChild(document.importNode(imageBannerTemplate.content, true));
		const caption = this.#shadow.querySelector(".image-banner__caption");
		const captionSlot = this.#shadow.querySelector('slot[name="caption"]');
		// An empty caption would still draw its white bar over the image.
		captionSlot.addEventListener("slotchange", () => {
			caption.hidden = captionSlot.assignedNodes().length === 0;
		});
	}
}

if (!customElements.get("ycl-image-banner")) customElements.define("ycl-image-banner", ImageBanner);
