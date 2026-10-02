import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const linkSkipTemplate = document.createElement("template");
linkSkipTemplate.innerHTML = `
	<a class="link-skip__link" href="#main-content"><slot>Skip to main content</slot></a>
`;

// The link stays visually hidden until it takes keyboard focus (see link-skip.css).
export class LinkSkip extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["href"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(linkSkipTemplate.content, true));
		this.link = this.#shadow.querySelector("a");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "href") this.link.setAttribute("href", newValue ?? "#main-content");
	}

	get href() { return this.getAttribute("href"); }
	set href(value) { this.setAttribute("href", value); }
}

customElements.define("ycl-link-skip", LinkSkip);
