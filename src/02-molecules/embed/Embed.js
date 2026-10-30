import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./embed.css?inline";

const embedTemplate = document.createElement("template");
embedTemplate.innerHTML = `
	<div class="embed">
		<div class="embed__inner"><slot></slot></div>
	</div>
`;

// Without a src, the default slot renders instead, for script-driven embeds (Instagram, X,
// Bluesky) whose blockquote and <script> have to live in the document to run.
/**
 * An embedded iframe (form, map, calendar, audio, video), or slotted embed code for script-driven embeds.
 * @attr {string} src - URL to load in the iframe. Without it, the slotted content shows instead.
 * @attr {string} label - Accessible title for the iframe.
 * @attr {"form"|"audio"|"video"|"map"|"calendar"|"unknown"} type - Kind of embed; sets the frame's size.
 * @attr {"lazy"|"eager"} loading - When to load the iframe. Defaults to lazy.
 * @attr {boolean} allowfullscreen - Lets the embed go full screen.
 * @attr {"max"|"site"|"highlight"|"content"} width - Width of the embed.
 * @slot - Embed code that has to run in the page, such as an Instagram or X blockquote and its `<script>`.
 */
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
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "embed")];
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

if (!customElements.get("ycl-embed")) customElements.define("ycl-embed", Embed);
