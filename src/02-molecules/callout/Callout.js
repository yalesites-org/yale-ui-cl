import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./callout.css?inline";

const calloutsTemplate = document.createElement("template");
calloutsTemplate.innerHTML = `
	<div class="callouts">
		<div class="callouts__overlay_image" hidden></div>
		<div class="callouts__wrap">
			<div class="callouts__inner"><slot></slot></div>
		</div>
	</div>
`;

const calloutItemTemplate = document.createElement("template");
calloutItemTemplate.innerHTML = `
	<div class="callout">
		<div class="callout__inner">
			<div class="callout__heading"><slot name="heading"></slot></div>
			<div class="callout__text"><slot></slot></div>
			<slot name="link"></slot>
		</div>
	</div>
`;

export class CalloutItem extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "callout")];
		this.#shadow.appendChild(document.importNode(calloutItemTemplate.content, true));
	}
}

export class Callout extends HTMLElement {
	#shadow;

	static get observedAttributes() {
		return ["overlay-image"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "callout")];
		this.#shadow.appendChild(document.importNode(calloutsTemplate.content, true));
		this.overlay = this.#shadow.querySelector(".callouts__overlay_image");
	}

	// Theme and alignment are pure CSS (:host([theme]) etc.); only the overlay needs the DOM.
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "overlay-image") {
			this.overlay.hidden = !newValue;
			// JSON.stringify gives a double-quoted, escaped string that's also a valid CSS string.
			if (newValue) this.overlay.style.setProperty("--overlay-bg-image", `url(${JSON.stringify(newValue)})`);
			else this.overlay.style.removeProperty("--overlay-bg-image");
		}
	}

	get overlayImage() { return this.getAttribute("overlay-image"); }
	set overlayImage(value) {
		if (value) this.setAttribute("overlay-image", value);
		else this.removeAttribute("overlay-image");
	}
}

if (!customElements.get("ycl-callout")) customElements.define("ycl-callout", Callout);
if (!customElements.get("ycl-callout-item")) customElements.define("ycl-callout-item", CalloutItem);
