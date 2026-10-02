import baseStyles from "../../styles/base.css?inline";
import { icons } from "./icons.js";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const iconTemplate = document.createElement("template");
iconTemplate.innerHTML = `
	<svg class="icon" focusable="false" aria-hidden="true"><path></path></svg>
`;

export class Icon extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["name", "label"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(iconTemplate.content, true));
		this.svg = this.#shadow.querySelector(".icon");
		this.path = this.svg.querySelector("path");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "name") {
			const icon = icons[newValue];
			if (!icon) console.warn(`ycl-icon: unknown icon "${newValue}"`);
			this.svg.setAttribute("viewBox", icon?.viewBox ?? "0 0 0 0");
			this.path.setAttribute("d", icon?.path ?? "");
		}
		if (name === "label") {
			// Decorative unless labelled: an unlabelled icon is hidden so screen readers skip it.
			if (newValue) {
				this.svg.removeAttribute("aria-hidden");
				this.svg.setAttribute("role", "img");
				this.svg.setAttribute("aria-label", newValue);
			} else {
				this.svg.setAttribute("aria-hidden", "true");
				this.svg.removeAttribute("role");
				this.svg.removeAttribute("aria-label");
			}
		}
	}

	get name() { return this.getAttribute("name"); }
	set name(value) { this.setAttribute("name", value); }

	get label() { return this.getAttribute("label"); }
	set label(value) {
		if (value) this.setAttribute("label", value);
		else this.removeAttribute("label");
	}
}

customElements.define("ycl-icon", Icon);
