//import * as Util from "../../utility.js"
import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const accordionOuterTemplate = document.createElement("template");
accordionOuterTemplate.innerHTML = `
  	<div class="accordion">
		<div class="accordion-inner">
			<div><slot name="heading"></slot></div>
			<ul style="" aria-label="Section controls" class="accordion__controls">
        		<li class="item">
        			<button aria-expanded="false" class="accordion__toggle-all">Expand All
        			
        			</button>
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
		this.trigger.addEventListener("click", this.clickHandler());
	}

	clickHandler = () => {
		console.log("You clicked the trigger!")
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
