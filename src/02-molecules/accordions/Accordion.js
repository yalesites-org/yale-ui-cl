import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const accordionOuterTemplate = document.createElement("template");
accordionOuterTemplate.innerHTML = `
  	<div class="accordion">
		<div class="accordion-inner">
			<div><slot name="heading"></slot></div>
			<ul style="list-style: none;" aria-label="Section controls" class="accordion__controls">
        		<li class="item">
        			<button class="accordion__expand-all">Expand All</button>
          		</li>
				<li class="item">
					<button class="accordion__collapse-all">Collapse All</button>
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
			<button class="trigger" id="trigger" aria-expanded="false" aria-controls="content"><slot name="heading"></slot></button>
		</div>
		<div class="accordion-item__content" id="content" role="region" aria-labelledby="trigger" hidden><slot></slot></div>
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
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(accordionItemTemplate.content, true));
		this.trigger = this.#shadow.querySelector(".trigger");
		this.content = this.#shadow.querySelector(".accordion-item__content");
		this.trigger.addEventListener("click", this.clickHandler);
	};

	// The expanded attribute is the single source of truth; the DOM always mirrors it
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "expanded") {
			this.content.hidden = !this.expanded;
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
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
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

customElements.define("ycl-accordion", Accordion);
customElements.define("ycl-accordion-item", AccordionItem)
