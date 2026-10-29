import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./accordion.css?inline";
import { iconSvg } from "../../01-atoms/icons/icons.js";

const angleDownIcon = (className) => iconSvg("angle-down", className);

const accordionOuterTemplate = document.createElement("template");
accordionOuterTemplate.innerHTML = `
  	<div class="accordion">
		<div class="accordion__inner">
			<div class="accordion__heading"><slot name="heading"></slot></div>
			<ul aria-label="Section controls" class="accordion__controls">
        		<li class="item">
        			<button class="accordion__toggle-all accordion__expand-all">Expand All ${angleDownIcon("accordion__icon")}</button>
          		</li>
				<li class="item">
					<button class="accordion__toggle-all accordion__collapse-all">Collapse All ${angleDownIcon("accordion__icon accordion__icon--up")}</button>
				</li>
      		</ul>
  			<div class="accordion__items"><slot></slot></div>
  		</div>
	</div>
`;

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
		this.#shadow = this.attachShadow({ mode: "open"});
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

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "open" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "accordion")];
		this.#shadow.appendChild(document.importNode(accordionOuterTemplate.content, true),);
		this.#shadow.querySelector(".accordion__expand-all").addEventListener("click", () => this.setAll(true));
		this.#shadow.querySelector(".accordion__collapse-all").addEventListener("click", () => this.setAll(false));
	}

	setAll(expanded) {
		this.querySelectorAll(":scope > ycl-accordion-item").forEach((item) => {
			item.expanded = expanded;
		});
	}
}

if (!customElements.get("ycl-accordion")) customElements.define("ycl-accordion", Accordion);
if (!customElements.get("ycl-accordion-item")) customElements.define("ycl-accordion-item", AccordionItem);
