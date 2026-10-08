import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./pull-quote.css?inline";

// Whitespace-only text (template formatting) doesn't count as content.
const hasContent = (slot) => slot.assignedNodes({ flatten: true })
	.some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());

// variant and theme are pure CSS (:host([attr])).
const pullQuoteTemplate = document.createElement("template");
pullQuoteTemplate.innerHTML = `
	<div class="pull-quote">
		<div class="pull-quote__inner">
			<figure class="pull-quote__figure">
				<blockquote class="pull-quote__quote"><slot></slot></blockquote>
				<figcaption class="pull-quote__attribution"><span aria-hidden="true">—</span><slot name="attribution"></slot></figcaption>
			</figure>
		</div>
	</div>
`;

export class PullQuote extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "pull-quote")];
		this.#shadow.appendChild(document.importNode(pullQuoteTemplate.content, true));

		// No attribution means no figcaption, or the em dash would be left on its own.
		const attribution = this.#shadow.querySelector('slot[name="attribution"]');
		const update = () => { attribution.parentElement.hidden = !hasContent(attribution); };
		attribution.addEventListener("slotchange", update);
		update();
	}
}

if (!customElements.get("ycl-pull-quote")) customElements.define("ycl-pull-quote", PullQuote);
