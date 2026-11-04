import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./read-time.css?inline";

// Reportedly the low end of average adult reading speed in the US (same figure as the Twig behavior).
const DEFAULT_WORDS_PER_MINUTE = 200;

const readTimeTemplate = document.createElement("template");
readTimeTemplate.innerHTML = `
	<div class="read-time">
		<div class="read-time__inner">
			<span class="read-time__label">Estimated read time</span>:
			<span class="read-time__time">0</span>
			<span class="read-time__time__minutes">min</span>
		</div>
	</div>
`;

export class ReadTime extends HTMLElement {
	#shadow;
	#observer;
	#target;
	static get observedAttributes() {
		return ["label", "target", "words-per-minute"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "read-time")];
		this.#shadow.appendChild(document.importNode(readTimeTemplate.content, true));
		this.labelEl = this.#shadow.querySelector(".read-time__label");
		this.timeEl = this.#shadow.querySelector(".read-time__time");
		// Recount when the measured content changes (e.g. content rendered after this element).
		this.#observer = new MutationObserver(() => this.update());
	}

	connectedCallback() {
		this.#observe();
	}

	disconnectedCallback() {
		this.#observer.disconnect();
		this.#target = null;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "label") this.labelEl.textContent = newValue ?? "Estimated read time";
		if (name === "target" && this.isConnected) this.#observe();
		if (name === "words-per-minute") this.update();
	}

	// The element measures the content matched by its target selector, falling back to its parent
	// so it can simply be dropped inside the article it describes. Its own label lives in the
	// shadow root, so it never counts towards the total.
	#observe() {
		this.#observer.disconnect();
		let target = null;
		try {
			target = document.querySelector(this.target);
		} catch {
			// An invalid selector is treated like one that matches nothing.
		}
		this.#target = target ?? this.parentElement;
		if (!this.#target) return;
		this.#observer.observe(this.#target, { childList: true, subtree: true, characterData: true });
		this.update();
	}

	update() {
		if (!this.#target) return;
		const words = this.#target.textContent.split(/\s+/).filter(Boolean).length;
		const perMinute = Number(this.getAttribute("words-per-minute")) || DEFAULT_WORDS_PER_MINUTE;
		this.timeEl.textContent = words > perMinute ? String(Math.ceil(words / perMinute)) : "less than 1";
	}

	get target() { return this.getAttribute("target") || "#main-content"; }
	set target(value) {
		if (value) this.setAttribute("target", value);
		else this.removeAttribute("target");
	}
}

if (!customElements.get("ycl-read-time")) customElements.define("ycl-read-time", ReadTime);
