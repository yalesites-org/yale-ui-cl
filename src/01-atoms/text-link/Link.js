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
const currentURL = window.location.origin;




export class TextLink extends HTMLElement { #shadow;
  static get observedAttributes() {
    return ["href", "class", "target"];
  }

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'closed' });
    this.#shadow.adoptedStyleSheets = [baseSheet, sheet]
  }

  connectedCallback() {
	this.#shadow.appendChild(document.importNode(linkTemplate.content, true));
	this.#updateHref();
	this.#updateVariant();

  }

  attributeChangedCallback(name, oldValue, newValue) {
	if (oldValue === newValue) return;
	const a = this.#shadow.querySelector("a");
	if (name === "href") this.#updateHref();
	if (name === "class") this.#updateVariant();
	if (name === "target") this.#updateIcon();
  }

  #updateHref() {
    const a = this.#shadow.querySelector("a");
    if (!a) return;
    a.href = this.getAttribute("href") ?? "#";
    console.log(a.origin);
    console.log(currentURL);
    if (a.origin !== currentURL) {
      a.insertAdjacentHTML("beforeend", `
      <span class="fa-icon fa-solid fa-arrow-up-right"><span class="visually-hidden">(link is external)</span></span>
	`);
    }
  }
  

  #updateVariant() {
    const a = this.#shadow.querySelector("a");
    if (!a) return;
    const variant = this.classList;
    if (variant) variant.forEach((variant) => { a.classList.add('link--' + variant);});
  }

  #updateIcon() {
    const a = this.#shadow.querySelector("a");
    if (!a) return;

  }}
 
customElements.define("text-link", TextLink);
