import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./container.css?inline";

const containerTemplate = document.createElement("template");
containerTemplate.innerHTML = `<slot></slot>`;

/**
 * A spacing container. It centers its content, caps it at a layout width and pads it with the
 * site gutter, all from the spacing tokens. UICL ships no page or section layouts: arrange the
 * content inside however the page needs.
 * @attr {"site"|"content"|"highlight"|"max"|"full"} width - Widest the content gets. Defaults to site. full has no cap.
 * @attr {"none"|"section"} spacing - Space above and below. section adds the page section spacing. Defaults to none.
 * @attr {"none"} gutter - none drops the side padding, for a container nested in another.
 * @slot - The content to wrap.
 */
export class Container extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "container")];
		this.#shadow.appendChild(document.importNode(containerTemplate.content, true));
	}
}

if (!customElements.get("ycl-container")) customElements.define("ycl-container", Container);
