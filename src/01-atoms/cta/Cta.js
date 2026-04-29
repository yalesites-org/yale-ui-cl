import baseStyles from '../../styles/base.css?inline';
import * as Util from '../../utility.js';
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);
const ctaTemplate = document.createElement('template');
ctaTemplate.innerHTML = `
  <a class="cta" href="#"><slot>Default Link</slot></a>
`;

export class Cta extends HTMLElement { #shadow;
  static get observedAttributes() {
    return ["href", "class"];
  }

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'closed' });
	this.#shadow.appendChild(document.importNode(ctaTemplate.content, true));
    this.#shadow.adoptedStyleSheets = [baseSheet];
	this.link = this.#shadow.querySelector("a");
  }

  attributeChangedCallback(name, oldValue, newValue) {
	if (oldValue === newValue) return;
	if (name === "href") this.link.href = newValue;
	if (name === "class") {
		Util.addVariant(newValue, this.link, "cta");
	}
  }
  
  get href() { return this.getAttribute("href"); }
  
  set href(value) { return this.setAttribute("href", value); }
}

 
customElements.define("cta-link", Cta);
