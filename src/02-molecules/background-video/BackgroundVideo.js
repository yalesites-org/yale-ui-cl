import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./background-video.css?inline";
import "../../01-atoms/button/Button.js";
import { iconSvg } from "../../01-atoms/icons/icons.js";

const pauseIcon = iconSvg("circle-pause-regular", "background-video__icon");
const playIcon = iconSvg("circle-play-regular", "background-video__icon");

const template = document.createElement("template");
template.innerHTML = `
	<div class="background-video">
		<video class="background-video__video" muted loop playsinline aria-hidden="true"></video>
		<div class="background-video__content"><slot></slot></div>
		<ycl-button class="background-video__control" variant="filled" radius="pill"></ycl-button>
	</div>
`;

/**
 * A muted, looping video that plays behind content, with a pause/play button (WCAG 2.2.2).
 * With prefers-reduced-motion it does not autoplay and shows the poster image.
 * @attr {string} src - URL of the video file.
 * @attr {string} poster - Image shown before the video loads and while it is paused.
 * @slot - Content placed over the video.
 */
export class BackgroundVideo extends HTMLElement {
	#shadow;
	#video;
	#control;
	#playing = false;
	#started = false;

	static get observedAttributes() {
		return ["src", "poster"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "background-video")];
		this.#shadow.appendChild(document.importNode(template.content, true));
		this.#video = this.#shadow.querySelector("video");
		this.#control = this.#shadow.querySelector("ycl-button");
		// Setting the property is what makes the video muted; the attribute alone only sets the default.
		this.#video.muted = true;
		this.#control.addEventListener("click", this.#toggle);
		this.#renderControl();
	}

	connectedCallback() {
		this.#sync("src");
		this.#sync("poster");
		// Autoplay once; moving the element in the DOM must not restart a video the visitor paused.
		if (this.#started) return;
		this.#started = true;
		if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) this.#play();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue !== newValue) this.#sync(name);
	}

	#sync(name) {
		const value = this.getAttribute(name);
		if (value == null) this.#video.removeAttribute(name);
		else this.#video.setAttribute(name, value);
	}

	#play() {
		this.#playing = true;
		this.#renderControl();
		// play() rejects when the browser blocks autoplay; then the poster stays and the control offers Play.
		Promise.resolve(this.#video.play()).catch(() => {
			this.#playing = false;
			this.#renderControl();
		});
	}

	#pause() {
		this.#playing = false;
		this.#video.pause();
		this.#renderControl();
	}

	#toggle = () => (this.#playing ? this.#pause() : this.#play());

	#renderControl() {
		this.#control.setAttribute("label", this.#playing ? "Pause background video" : "Play background video");
		this.#control.innerHTML = this.#playing ? pauseIcon : playIcon;
	}
}

if (!customElements.get("ycl-background-video")) customElements.define("ycl-background-video", BackgroundVideo);
