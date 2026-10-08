import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./video.css?inline";

const videoTemplate = document.createElement("template");
videoTemplate.innerHTML = `
	<div class="video">
		<div class="video__inner">
			<div class="video__video"><slot></slot></div>
			<div class="video__content" hidden>
				<div class="video__heading"><slot name="heading"></slot></div>
				<div class="video__text"><slot name="text"></slot></div>
			</div>
		</div>
	</div>
`;

export class Video extends HTMLElement {
	#shadow;
	#content;
	#slots;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "video")];
		this.#shadow.appendChild(document.importNode(videoTemplate.content, true));
		this.#content = this.#shadow.querySelector(".video__content");
		this.#slots = this.#shadow.querySelectorAll("slot[name]");
		this.#slots.forEach((slot) => slot.addEventListener("slotchange", this.#updateContent));
	}

	// The caption block only renders when there's a heading or text to put in it, so an empty
	// one doesn't add a gap below the video.
	#updateContent = () => {
		const hasContent = [...this.#slots].some((slot) => slot.assignedNodes().length > 0);
		this.#content.hidden = !hasContent;
	};
}

if (!customElements.get("ycl-video")) customElements.define("ycl-video", Video);
