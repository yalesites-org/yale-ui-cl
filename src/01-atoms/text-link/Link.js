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
    this.#shadow.adoptedStyleSheets = [baseSheet, sheet];
	this.#shadow.appendChild(document.importNode(linkTemplate.content, true));
	this.link = this.#shadow.querySelector("a");
  }


  attributeChangedCallback(name, oldValue, newValue) {
	if (oldValue === newValue) return;
	if (name === "href") {
		this.link.href = newValue;
		if (this.link.origin != currentURL) {
     	   this.link.insertAdjacentHTML("beforeend", `
			<span class="fa-icon fa-solid fa-arrow-up-right"><span class="visually-hidden">(link is external)</span></span>`);
		};
	}
	if (name === "class") this.link.classList.add("link--" + newValue);
  }

  get href() { return this.getAttribute("href"); }

  set href(value) { return this.setAttribute("href", value); }
}


customElements.define("text-link", TextLink);
