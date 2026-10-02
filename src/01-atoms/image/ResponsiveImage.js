import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const imageTemplate = document.createElement("template");
imageTemplate.innerHTML = `
	<figure class="figure" role="none">
		<slot></slot>
		<figcaption class="caption" hidden><slot name="caption"></slot></figcaption>
	</figure>
`;

// Not named Image, which would shadow the global HTMLImageElement constructor for importers.
export class ResponsiveImage extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
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

customElements.define("ycl-image", ResponsiveImage);
