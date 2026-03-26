import linkStyles from './link.css?inline';
import baseStyles from '../../styles/base.css?inline';
const sheet = new CSSStyleSheet();
sheet.replaceSync(linkStyles);

const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);
const linkTemplate = document.createElement('template');
linkTemplate.innerHTML = `
  <a class="link" href="#"><slot>Default Link</slot></a>
`;

export class TextLink extends HTMLElement { #shadow;
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
	this.#shadow.appendChild(document.importNode(linkTemplate.content, true));
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
    if (variant) variant.forEach((variant) => { a.classList.add('link--' + variant);});
  }
}
 
customElements.define("text-link", TextLink);
