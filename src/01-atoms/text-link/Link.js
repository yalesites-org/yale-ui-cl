import { baseSheet, componentSheet } from '../../styles/shadow.js';
import componentStyles from './link.css?inline';
import * as Util from '../../utility.js'
import { iconSvg } from '../icons/icons.js';

const linkTemplate = document.createElement('template');
// No whitespace around the <a>: the host is inline, so it would render as a stray space.
linkTemplate.innerHTML = `<a class="link" href="#" data-link-style="underline"><slot></slot></a>`;
// link-style values, as in the YaleSites text link; anything else falls back to underline.
const LINK_STYLES = ["underline", "no-underline", "no-animation"];
const currentURL = window.location.origin;

export class TextLink extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["href", "class", "target", "link-style", "chevron"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({
			mode: 'closed'
		});
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, 'text-link')];
		this.#shadow.appendChild(document.importNode(linkTemplate.content, true));
		this.link = this.#shadow.querySelector("a");
		
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "href") this.link.href = newValue;
		if (name === "class") Util.addVariant(newValue, this.link, "link");
		if (name === "target") this.link.target = newValue;
		if (name === "link-style") this.link.dataset.linkStyle = this.linkStyle;
		this.#updateIcon();
	}

	// One icon at most. A chevron outranks the external/download/new-window icon, as it does in
	// the YaleSites link treatment, and is decorative: it adds nothing to the link's name.
	#updateIcon() {
		const icon = this.#shadow.querySelector(".fa-icon");
		if (this.chevron) {
			icon?.remove();
			this.link.insertAdjacentHTML("beforeend", iconSvg("angle-right", "fa-icon link__chevron"));
		} else {
			Util.updateLinkIcon(icon, this.link, currentURL);
		}
	}

	get href() {
		return this.getAttribute("href");
	}
	get target() {
		return this.getAttribute("target");
	}

	set href(value) {
		this.setAttribute("href", value);
	}
	set target(value) {
		this.setAttribute("target", value);
	}

	get linkStyle() {
		const style = this.getAttribute("link-style");
		return LINK_STYLES.includes(style) ? style : "underline";
	}
	set linkStyle(value) {
		this.setAttribute("link-style", value);
	}

	get chevron() {
		return this.hasAttribute("chevron");
	}
	set chevron(value) {
		if (value) this.setAttribute("chevron", "");
		else this.removeAttribute("chevron");
	}

}


if (!customElements.get("text-link")) customElements.define("text-link", TextLink);
