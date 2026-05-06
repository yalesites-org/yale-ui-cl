import baseStyles from '../../styles/base.css?inline';
import * as Util from '../../utility.js'
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const linkTemplate = document.createElement('template');
linkTemplate.innerHTML = `
  <a class="link" href="#"><slot></slot></a>
`;
const currentURL = window.location.origin;

export class TextLink extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["href", "class", "target"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({
			mode: 'closed'
		});
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(linkTemplate.content, true));
		this.link = this.#shadow.querySelector("a");
		
	}

	attributeChangedCallback(name, oldValue, newValue) {
		this.icon = this.#shadow.querySelector(".fa-icon");
		if (oldValue === newValue) return;
		if (name === "href") this.link.href = newValue;
		if (name === "class") Util.addVariant(newValue, this.link, "link");
		if (name === "target") this.link.target = newValue;
		Util.updateLinkIcon(this.icon, this.link, currentURL);
	}

	get href() {
		return this.getAttribute("href");
	}
	get target() {
		return this.getAttribute("target");
	}

	set href(value) {
		return this.setAttribute("href", value);
	}
	set target(value) {
		return this.setAttribute("target", value);
	}

}


customElements.define("text-link", TextLink);
