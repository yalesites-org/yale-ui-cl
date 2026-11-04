import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./accordion.css?inline";
import { iconSvg } from "../../01-atoms/icons/icons.js";

const angleDownIcon = (className) => iconSvg("angle-down", className);

// One toggle-all button, as in YaleSites: it reads Expand All until every item is open, then
// Collapse All. The controls stay hidden until there's more than one item to toggle.
const accordionOuterTemplate = document.createElement("template");
accordionOuterTemplate.innerHTML = `
	<div class="accordion" data-component-width="content" data-component-alignment="center">
		<div class="accordion__inner">
			<div class="accordion__heading"><slot name="heading"></slot></div>
			<ul aria-label="Section controls" class="accordion__controls" hidden>
				<li class="item">
					<button class="accordion__toggle-all" type="button"><span class="accordion__toggle-all-label">Expand All</span> ${angleDownIcon("accordion__icon")}</button>
				</li>
			</ul>
			<div class="accordion__items"><slot></slot></div>
		</div>
	</div>
`;

// The YaleSites accordion's width and alignment options, and their defaults.
const WIDTHS = ["content", "highlight", "site", "max"];
const ALIGNMENTS = ["center", "left"];

// Items are <div>s rather than <li>s: each item lives in its own shadow root, so it can never be
// a real child of a list in the parent's shadow root.
const accordionItemTemplate = document.createElement("template");
accordionItemTemplate.innerHTML = `
	<div class="accordion-item">
		<div class="accordion-item__heading">
			<button class="accordion-item__toggle" id="trigger" aria-expanded="false" aria-controls="content"><slot name="heading"></slot>${angleDownIcon("accordion-item__icon")}</button>
		</div>
		<div class="accordion-item__content" id="content" role="region" aria-labelledby="trigger">
			<div class="accordion-item__content-inner"><div class="accordion-item__body"><slot></slot></div></div>
		</div>
	</div>
`

export class AccordionItem extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ['expanded']
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed"});
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "accordion")];
		this.#shadow.appendChild(document.importNode(accordionItemTemplate.content, true));
		this.trigger = this.#shadow.querySelector(".accordion-item__toggle");
		this.trigger.addEventListener("click", this.clickHandler);
	};

	// The expanded attribute is the single source of truth; the DOM always mirrors it.
	// Content visibility is driven from CSS via :host([expanded]) so it can animate.
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "expanded") {
			this.trigger.setAttribute("aria-expanded", String(this.expanded));
		}
	}

	clickHandler = () => {
		this.expanded = !this.expanded;
	};

	get expanded() { return this.hasAttribute("expanded"); }
	set expanded(value) {
		if (value) this.setAttribute("expanded", "");
		else this.removeAttribute("expanded");
	}
}


export class Accordion extends HTMLElement {
	#shadow;
	#root;
	#controls;
	#toggle;
	#label;
	#observer;

	static get observedAttributes() {
		return ["width", "alignment"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "accordion")];
		this.#shadow.appendChild(document.importNode(accordionOuterTemplate.content, true),);
		this.#root = this.#shadow.querySelector(".accordion");
		this.#controls = this.#shadow.querySelector(".accordion__controls");
		this.#toggle = this.#shadow.querySelector(".accordion__toggle-all");
		this.#label = this.#shadow.querySelector(".accordion__toggle-all-label");
		this.#toggle.addEventListener("click", () => this.setAll(!this.#allExpanded()));
		// Items opened or closed one at a time, or added and removed, update the toggle too.
		this.#observer = new MutationObserver(() => this.#updateControls());
	}

	connectedCallback() {
		this.#observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ["expanded"] });
		this.#updateControls();
	}

	disconnectedCallback() {
		this.#observer.disconnect();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "width") this.#root.dataset.componentWidth = this.width;
		if (name === "alignment") this.#root.dataset.componentAlignment = this.alignment;
	}

	#items() {
		return [...this.querySelectorAll(":scope > ycl-accordion-item")];
	}

	// Read and write the expanded attribute, not the property: items in the page before this module
	// runs may not be upgraded yet when the accordion connects, so they have no expanded accessor.
	#allExpanded(items = this.#items()) {
		return items.length > 0 && items.every((item) => item.hasAttribute("expanded"));
	}

	#updateControls() {
		const items = this.#items();
		const expanded = this.#allExpanded(items);
		this.#controls.hidden = items.length < 2;
		this.#label.textContent = expanded ? "Collapse All" : "Expand All";
		// No expanded state for screen readers: the label already says what the button does, and
		// both would read "Collapse All, expanded". data-expanded only rotates the arrow.
		this.#toggle.toggleAttribute("data-expanded", expanded);
	}

	setAll(expanded) {
		this.#items().forEach((item) => {
			item.toggleAttribute("expanded", expanded);
		});
		this.#updateControls();
	}

	get width() {
		const width = this.getAttribute("width");
		return WIDTHS.includes(width) ? width : "content";
	}
	set width(value) { this.setAttribute("width", value); }

	get alignment() {
		const alignment = this.getAttribute("alignment");
		return ALIGNMENTS.includes(alignment) ? alignment : "center";
	}
	set alignment(value) { this.setAttribute("alignment", value); }
}

// Define the item first so markup already in the page has upgraded items when the accordion connects.
if (!customElements.get("ycl-accordion-item")) customElements.define("ycl-accordion-item", AccordionItem);
if (!customElements.get("ycl-accordion")) customElements.define("ycl-accordion", Accordion);
