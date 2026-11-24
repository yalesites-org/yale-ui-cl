import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./divider.css?inline";

const dividerTemplate = document.createElement("template");
dividerTemplate.innerHTML = `
	<div class="divider__wrapper">
		<div class="divider__inner">
			<div class="divider"></div>
		</div>
	</div>
`;

/**
 * A horizontal rule.
 * @attr {"100"|"75"|"50"|"25"} width - Width as a percentage of the container. Defaults to 100.
 * @attr {"center"|"left"|"right"} position - Horizontal position when narrower than the container. Defaults to center.
 * @attr {"hairline"|"1"|"2"|"4"|"6"|"8"} thickness - Line thickness.
 * @attr {boolean} animate - Expands the line out the first time it scrolls into view.
 * @cssprop --color-divider - Line color. Set it to a token, such as var(--color-blue-yale).
 * @cssprop --thickness-divider - Line thickness. Set it to a token, such as var(--size-thickness-2).
 */
export class Divider extends HTMLElement {
	#shadow;
	#observer;

	static get observedAttributes() {
		return ["animate"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "divider")];
		this.#shadow.appendChild(document.importNode(dividerTemplate.content, true));
		this.line = this.#shadow.querySelector(".divider");
	}

	// Width, position and thickness are pure styling, read straight from the host attributes in CSS.
	// Only the expand-out animation needs JS: it plays the first time the divider scrolls into view.
	attributeChangedCallback(name) {
		if (name === "animate") this.#setUpAnimation();
	}

	connectedCallback() {
		this.#setUpAnimation();
	}

	disconnectedCallback() {
		this.#observer?.disconnect();
		this.#observer = null;
	}

	#setUpAnimation() {
		this.#observer?.disconnect();
		this.#observer = null;
		this.line.classList.remove("animate");
		if (!this.animate || !this.isConnected) return;
		this.#observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				this.line.classList.add("animate");
				this.#observer.disconnect();
			}
		});
		this.#observer.observe(this);
	}

	get animate() { return this.hasAttribute("animate"); }
	set animate(value) {
		if (value) this.setAttribute("animate", "");
		else this.removeAttribute("animate");
	}
}

if (!customElements.get("ycl-divider")) customElements.define("ycl-divider", Divider);
