import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./wrapped-callout.css?inline";

// Whitespace-only text (template formatting) doesn't count as content.
const hasContent = (slot) => slot.assignedNodes({ flatten: true })
	.some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());

// The callout box comes first so the body text in the default slot flows around it when floated.
// alignment and theme are pure CSS (:host([attr])).
const wrappedCalloutTemplate = document.createElement("template");
wrappedCalloutTemplate.innerHTML = `
	<div class="wrapped-callout">
		<div class="wrapped-callout__inner">
			<div class="wrapped-callout__content-wrapper">
				<div class="wrapped-callout__callout"><slot name="callout"></slot></div>
				<div class="wrapped-callout__content"><slot></slot></div>
			</div>
		</div>
	</div>
`;

export class WrappedCallout extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "wrapped-callout")];
		this.#shadow.appendChild(document.importNode(wrappedCalloutTemplate.content, true));

		// The box only floats when there's body text to wrap around it.
		const wrapper = this.#shadow.querySelector(".wrapped-callout");
		for (const slot of this.#shadow.querySelectorAll("slot")) {
			const update = () => {
				const filled = hasContent(slot);
				slot.parentElement.hidden = !filled;
				if (!slot.name) wrapper.classList.toggle("wrapped-callout--has-content", filled);
			};
			slot.addEventListener("slotchange", update);
			update();
		}
	}
}

if (!customElements.get("ycl-wrapped-callout")) customElements.define("ycl-wrapped-callout", WrappedCallout);
