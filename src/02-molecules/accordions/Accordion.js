//import * as Util from "../../utility.js"
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
  			<ul><slot></slot></ul>
  		</div>
	</div>
`;

const accordionItemTemplate = document.createElement("template");
accordionItemTemplate.innerHTML = `
	<li class="accordion-item">
		<div class="accordion-item__heading"><button class="trigger"><slot name="heading"></slot></button></div>
		<div class="accordion-item__content"><slot></slot></div>
	</li>
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

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "expanded") {
			this.content.classList.remove("hidden")
		}
	}

	clickHandler = () => {
		this.content.classList.toggle("hidden");
	};

	get expanded() { return this.getAttribute("expanded")}
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
	}

	
	
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		}
	
	
		
	
}

customElements.define("ycl-accordion", Accordion);
customElements.define("ycl-accordion-item", AccordionItem)
