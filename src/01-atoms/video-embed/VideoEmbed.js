import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const videoEmbedTemplate = document.createElement("template");
videoEmbedTemplate.innerHTML = `
	<div class="video-embed">
		<slot></slot>
	</div>
`;

export class VideoEmbed extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["src", "video-title"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(videoEmbedTemplate.content, true));
		this.container = this.#shadow.querySelector(".video-embed");
		this.#shadow.querySelector("slot").addEventListener("slotchange", this.slotHandler);
	}

	// Two ways in: slot a provider's embed code (an <iframe>, <video>, etc.), or give a src and a
	// video-title and the component builds the iframe itself. (Not title: on the host that would
	// put a tooltip over the player.) A slotted embed wins over src.
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (!this.getAttribute("src")) {
			this.iframe?.remove();
			this.iframe = null;
			return;
		}
		if (!this.iframe) {
			this.iframe = document.createElement("iframe");
			this.iframe.className = "video-embed__iframe";
			this.iframe.loading = "lazy";
			this.iframe.allowFullscreen = true;
			this.iframe.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
			this.container.append(this.iframe);
		}
		this.iframe.src = this.getAttribute("src");
		this.iframe.title = this.getAttribute("video-title") || "Embedded video";
	}

	slotHandler = (event) => {
		const embed = event.target.assignedElements()[0];
		this.container.classList.toggle("video-embed--slotted", Boolean(embed));
		if (embed?.localName === "iframe" && !embed.title) {
			console.warn("ycl-video-embed: give the embedded iframe a descriptive title attribute.");
		}
	};

	get src() { return this.getAttribute("src"); }
	set src(value) {
		if (value) this.setAttribute("src", value);
		else this.removeAttribute("src");
	}
}

customElements.define("ycl-video-embed", VideoEmbed);
