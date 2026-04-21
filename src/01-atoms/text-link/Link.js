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
		this.#shadow.adoptedStyleSheets = [baseSheet, sheet];
		this.#shadow.appendChild(document.importNode(linkTemplate.content, true));
		this.link = this.#shadow.querySelector("a");
	}


	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "href") this.link.href = newValue;
		if (name === "class") this.link.classList.add("link--" + newValue);
		if (name === "target") this.link.target = newValue;
		this.#updateIcon();
	}

	#updateIcon() {
		const icon = this.#shadow.querySelector(".fa-icon");
		const extension = this.link.href.split(".").pop().toLowerCase();
		const downloadExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'csv', 'xml', 'rtf'];

		if (icon) icon.remove();
		
		if (downloadExts.includes(extension)) { // Download link
			this.link.insertAdjacentHTML("beforeend", `
	  		<span class="fa-icon fa-regular fa-circle-down"><span class="visually-hidden">(link is a download)</span></span>`);
		} else if (this.link.origin != currentURL) { // External link
			this.link.insertAdjacentHTML("beforeend", `
		<span class="fa-icon fa-solid fa-arrow-up-right"><span class="visually-hidden">(link is external)</span></span>`);
		} else if (this.link.target === "_blank") { // New window link
			this.link.insertAdjacentHTML("beforeend", `
		<span class="fa-icon fa-solid fa-arrow-up-right-from-square"><span class="visually-hidden">(link opens in new window)</span></span>`);
		} else return;
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
