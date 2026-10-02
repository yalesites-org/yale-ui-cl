import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const dividerTemplate = document.createElement("template");
dividerTemplate.innerHTML = `
	<div class="divider__wrapper">
		<div class="divider__inner">
			<div class="divider"></div>
		</div>
	</div>
`;

export class Divider extends HTMLElement {
	#shadow;
	#observer;

	static get observedAttributes() {
		return ["animate"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
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

customElements.define("ycl-divider", Divider);
