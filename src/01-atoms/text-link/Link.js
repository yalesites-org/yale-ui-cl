import ctaStyles from './cta.css?inline';
import baseStyles from '../../styles/base.css?inline';
const sheet = new CSSStyleSheet();
sheet.replaceSync(ctaStyles);

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
    console.log(baseSheet);
    console.log(sheet);
    this.#shadow.adoptedStyleSheets = [baseSheet, sheet]
  }

  connectedCallback() {
	this.#shadow.appendChild(document.importNode(ctaTemplate.content, true));
	this.#updateHref();
	this.#updateVariant();

  }

  attributeChangedCallback(name, oldValue, newValue) {
	if (oldValue === newValue) return;
	if (name === "href") this.#updateHref();
	if (name === "class") this.#updateVariant();
  }

  #updateHref() {
    const a = this.#shadow.querySelector("a");
    if (!a) return;
    a.href = this.getAttribute("href") ?? "#";
  }

  #updateVariant() {
    const a = this.#shadow.querySelector("a");
    if (!a) return;
    const variant = this.classList;
    if (variant) variant.forEach((variant) => { a.classList.add('cta--' + variant);});
  }
}
 
customElements.define("cta-link", Cta);
