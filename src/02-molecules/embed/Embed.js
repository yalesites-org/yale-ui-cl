import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const embedTemplate = document.createElement("template");
embedTemplate.innerHTML = `
	<div class="embed">
		<div class="embed__inner"><slot></slot></div>
	</div>
`;

// Without a src, the default slot renders instead, for script-driven embeds (Instagram, X,
// Bluesky) whose blockquote and <script> have to live in the document to run.
export class Embed extends HTMLElement {
	#shadow;
	#inner;
	#iframe = null;

	static get observedAttributes() {
		return ["src", "label", "type", "loading", "allowfullscreen"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(embedTemplate.content, true));
		this.#inner = this.#shadow.querySelector(".embed__inner");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this.#render();
	}

	#render() {
		const src = this.getAttribute("src");
		if (!src) {
			this.#iframe?.remove();
			this.#iframe = null;
			return;
		}
		if (!this.#iframe) {
			this.#iframe = document.createElement("iframe");
			this.#iframe.className = "embed__iframe";
			// Chrome and Firefox block clipboard writes inside a cross-origin iframe unless the
			// permission is delegated; copy buttons in every embed depend on this.
			this.#iframe.setAttribute("allow", "clipboard-write");
			this.#inner.prepend(this.#iframe);
		}
		// loading must be set before src, or the browser starts the load eagerly.
		this.#iframe.loading = this.getAttribute("loading") === "eager" ? "eager" : "lazy";
		this.#iframe.title = this.getAttribute("label") ?? "";
		this.#iframe.allowFullscreen = this.hasAttribute("allowfullscreen");
		if (this.#iframe.getAttribute("src") !== src) this.#iframe.src = src;
	}

	get src() { return this.getAttribute("src"); }
	set src(value) { this.setAttribute("src", value); }

	get allowFullscreen() { return this.hasAttribute("allowfullscreen"); }
	set allowFullscreen(value) {
		if (value) this.setAttribute("allowfullscreen", "");
		else this.removeAttribute("allowfullscreen");
	}
}

customElements.define("ycl-embed", Embed);
