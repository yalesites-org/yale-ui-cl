import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

// Whitespace-only text (template formatting) doesn't count as content.
const hasContent = (slot) => slot.assignedNodes({ flatten: true })
	.some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());

// variant, quote-alignment and theme are pure CSS (:host([attr])); the image wrapper only shows
// for variant="image".
const quoteCalloutTemplate = document.createElement("template");
quoteCalloutTemplate.innerHTML = `
	<div class="quote-callout">
		<div class="quote-callout__inner">
			<div class="quote-callout__image"><slot name="image"></slot></div>
			<figure class="quote-callout__figure">
				<blockquote class="quote-callout__quote"><slot></slot></blockquote>
				<figcaption class="quote-callout__attribution"><span aria-hidden="true">—</span><slot name="attribution"></slot></figcaption>
			</figure>
		</div>
	</div>
`;

export class QuoteCallout extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(quoteCalloutTemplate.content, true));

		// No attribution means no figcaption, or the em dash would be left on its own.
		const attribution = this.#shadow.querySelector('slot[name="attribution"]');
		const update = () => { attribution.parentElement.hidden = !hasContent(attribution); };
		attribution.addEventListener("slotchange", update);
		update();
	}
}

customElements.define("ycl-quote-callout", QuoteCallout);
