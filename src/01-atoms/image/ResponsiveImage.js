import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./image.css?inline";

const imageTemplate = document.createElement("template");
imageTemplate.innerHTML = `
	<figure class="figure" role="none">
		<slot></slot>
		<figcaption class="caption" hidden><slot name="caption"></slot></figcaption>
	</figure>
`;

// Not named Image, which would shadow the global HTMLImageElement constructor for importers.
/**
 * An image with an optional caption and fixed aspect ratio.
 * @attr {"16x9"|"4x3"|"3x2"|"2x3"|"1x1"|"1x1.6"} ratio - Crops the image to this aspect ratio.
 * @slot - The `<img>` or `<picture>`.
 * @slot caption - The caption. When present, the image becomes a figure.
 */
export class ResponsiveImage extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "image")];
		this.#shadow.appendChild(document.importNode(imageTemplate.content, true));
		this.figure = this.#shadow.querySelector(".figure");
		this.caption = this.#shadow.querySelector(".caption");
		this.#shadow.querySelector('slot[name="caption"]').addEventListener("slotchange", this.captionHandler);
	}

	// Like the Twig template, the image is only exposed as a figure when it has a caption;
	// otherwise the figure is presentational and the slotted <img>/<picture> stands alone.
	captionHandler = (event) => {
		const hasCaption = event.target.assignedNodes().length > 0;
		this.caption.hidden = !hasCaption;
		if (hasCaption) this.figure.removeAttribute("role");
		else this.figure.setAttribute("role", "none");
	};
}

if (!customElements.get("ycl-image")) customElements.define("ycl-image", ResponsiveImage);
