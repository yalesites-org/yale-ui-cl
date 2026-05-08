//import linkStyles from './link.css?inline';
import baseStyles from '../../styles/base.css?inline';
//const sheet = new CSSStyleSheet();
//sheet.replaceSync(linkStyles);
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const modalTemplate = document.createElement('template');
linkTemplate.innerHTML = `
 	<button id="trigger"><slot name="trigger">Open Dialog</slot></button>
	<div id="modal" class="hidden" aria-labelledby="modal-heading" aria-modal="true" role="dialog">
	<h2 id="modal-heading"><slot name="modal-heading"></slot></h2>
	<button id="close" aria-label="close dialog">X</button>
	<slot></slot>
	</div>
`;

export class Modal extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["hidden-heading"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({
			mode: 'closed'
		});
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(linkTemplate.content, true));
		this.trigger = this.#shadow.querySelector("#trigger");
		this.modal = this.#shadow.querySelector("#modal");
		this.heading = this.#shadow.querySelector("#modal-heading");
		this.close = this.#shadow.querySelector("#close");
		this.trigger.addEventListener("click", this.triggerHandler);
		this.close.addEventListener("click", this.closeHandler);
	}

	triggerHandler() { 
		if (this.modal.classList.contains("hidden")) {
			this.modal.classList.
		}
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "hidden-heading") this.heading.classList.add("visually-hidden") !== null;
			
		this.#updateIcon();
	}

	


}


customElements.define("yc-modal", Modal);
