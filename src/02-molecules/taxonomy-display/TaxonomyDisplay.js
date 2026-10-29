import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./taxonomy-display.css?inline";

const taxonomyDisplayTemplate = document.createElement("template");
taxonomyDisplayTemplate.innerHTML = `
	<div class="taxonomy-display">
		<div class="taxonomy-display__inner">
			<div class="taxonomy-display__content">
				<div class="taxonomy-display__list" role="list"><slot></slot></div>
			</div>
		</div>
	</div>
`;

// Each item lives in its own shadow root, so it can't be a real <li> of the parent's list; it takes
// the listitem role through ElementInternals, and also on the host attribute (see
// connectedCallback). The terms are slotted links grouped under the label, which also names the
// group for screen readers.
const taxonomyDisplayItemTemplate = document.createElement("template");
taxonomyDisplayItemTemplate.innerHTML = `
	<div class="taxonomy-display__item">
		<span class="taxonomy-display__item__label" id="label"></span>
		<div class="taxonomy-display__item__list" role="group" aria-labelledby="label">
			<span class="taxonomy-display__item__none">None</span>
			<slot></slot>
		</div>
	</div>
`;

export class TaxonomyDisplayItem extends HTMLElement {
	#shadow;
	#internals;
	static get observedAttributes() {
		return ["label"];
	}

	constructor() {
		super();
		this.#internals = this.attachInternals();
		this.#internals.role = "listitem";
		this.#shadow = this.attachShadow({ mode: "open" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "taxonomy-display")];
		this.#shadow.appendChild(document.importNode(taxonomyDisplayItemTemplate.content, true));
		this.labelEl = this.#shadow.querySelector(".taxonomy-display__item__label");
		this.listEl = this.#shadow.querySelector(".taxonomy-display__item__list");

		// "None" shows until terms are slotted; slotchange never fires for a slot that stays empty.
		const slot = this.#shadow.querySelector("slot");
		const none = this.#shadow.querySelector(".taxonomy-display__item__none");
		slot.addEventListener("slotchange", () => {
			const empty = slot.assignedElements().length === 0;
			none.hidden = !empty;
			this.listEl.classList.toggle("taxonomy-display__item__list--empty", empty);
		});
		this.listEl.classList.add("taxonomy-display__item__list--empty");
	}

	// Browsers read the ElementInternals role, but tools that inspect the DOM (axe among them) only
	// see attributes, and report the parent list as having no list items. Reflect the role on the
	// host too, unless the author has given the item a role of their own.
	connectedCallback() {
		if (!this.hasAttribute("role")) this.setAttribute("role", "listitem");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "label") this.labelEl.textContent = newValue ?? "";
	}

	get label() { return this.getAttribute("label"); }
	set label(value) { this.setAttribute("label", value); }
}

export class TaxonomyDisplay extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "open" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "taxonomy-display")];
		this.#shadow.appendChild(document.importNode(taxonomyDisplayTemplate.content, true));
	}
}

if (!customElements.get("ycl-taxonomy-display")) customElements.define("ycl-taxonomy-display", TaxonomyDisplay);
if (!customElements.get("ycl-taxonomy-display-item")) customElements.define("ycl-taxonomy-display-item", TaxonomyDisplayItem);
