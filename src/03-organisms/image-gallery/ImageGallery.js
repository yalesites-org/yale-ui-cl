import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./image-gallery.css?inline";
import { iconSvg } from "../../01-atoms/icons/icons.js";

const galleryTemplate = document.createElement("template");
galleryTemplate.innerHTML = `<ul class="gallery__list"></ul>`;

// The viewer is built once, the first time the gallery is made interactive. It is a native modal
// dialog, full screen and dark, so the browser supplies the top layer, the inert page behind it and
// Escape. The pager is a polite live region so a screen reader hears the position change.
const closeIcon = iconSvg("xmark", "viewer__close-icon");
const viewerTemplate = document.createElement("template");
viewerTemplate.innerHTML = `
	<dialog class="viewer" aria-label="Image viewer">
		<button class="viewer__close" type="button" aria-label="Close viewer">${closeIcon}</button>
		<div class="viewer__body">
			<button class="viewer__previous viewer__step" type="button" aria-label="Previous image">${iconSvg("angle-right", "viewer__step-icon")}</button>
			<div class="viewer__stage"></div>
			<button class="viewer__next viewer__step" type="button" aria-label="Next image">${iconSvg("angle-right", "viewer__step-icon")}</button>
		</div>
		<div class="viewer__caption" hidden>
			<p class="viewer__caption-text"></p>
			<button class="viewer__caption-toggle" type="button" aria-expanded="false" hidden>Show more</button>
		</div>
		<p class="viewer__pager" aria-live="polite"></p>
	</dialog>
`;

// A caption longer than this gets the expand toggle.
const CAPTION_LIMIT = 120;

/**
 * A grid of images: 2 across on small screens, 3 from the medium breakpoint, 4 from the large.
 * Add `interactive` to open each image in a full-screen viewer with previous and next buttons that
 * wrap around, a numbered pager and the image's caption.
 * Every child is one item: use a ycl-image (or a plain `<img>`), or a ycl-image-block when the item
 * has a caption; captions show in the viewer only. Each image needs alt text.
 * @attr {string} label - Accessible name of the list of images.
 * @attr {boolean} narrow - Keeps 2 across at every width, for a narrow column.
 * @attr {boolean} interactive - Opens each image in a full-screen viewer.
 * @slot - The items.
 */
export class ImageGallery extends HTMLElement {
	#shadow;
	#list;
	#observer;
	#items = [];
	#viewer = null;
	#bodyOverflow = "";
	#index = 0;

	static get observedAttributes() {
		return ["label", "interactive", "narrow"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed", slotAssignment: "manual" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "image-gallery")];
		this.#shadow.appendChild(document.importNode(galleryTemplate.content, true));
		this.#list = this.#shadow.querySelector(".gallery__list");
		this.#list.addEventListener("click", this.#clickHandler);
		this.#observer = new MutationObserver(() => this.#build());
	}

	connectedCallback() {
		this.#observer.observe(this, { childList: true });
		this.#build();
	}

	disconnectedCallback() {
		this.#observer.disconnect();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "label") {
			if (newValue) this.#list.setAttribute("aria-label", newValue);
			else this.#list.removeAttribute("aria-label");
		} else if (name === "interactive" && this.isConnected) {
			this.#build();
		}
	}

	/** Whether each image opens in a viewer. Reflects the interactive attribute. */
	get interactive() { return this.hasAttribute("interactive"); }
	set interactive(value) { this.toggleAttribute("interactive", Boolean(value)); }

	/** Whether the grid stays 2 across at every width. Reflects the narrow attribute. */
	get narrow() { return this.hasAttribute("narrow"); }
	set narrow(value) { this.toggleAttribute("narrow", Boolean(value)); }

	#build() {
		this.#items = [...this.children];
		this.#list.replaceChildren(...this.#items.map((item, index) => {
			const slot = document.createElement("slot");
			const li = document.createElement("li");
			li.className = "gallery__item";
			if (this.interactive) {
				const trigger = document.createElement("button");
				trigger.type = "button";
				trigger.className = "gallery__trigger";
				trigger.dataset.index = index;
				trigger.setAttribute("aria-haspopup", "dialog");
				trigger.append(slot);
				li.append(trigger);
			} else {
				li.append(slot);
			}
			slot.assign(item);
			return li;
		}));
		if (this.interactive) this.#ensureViewer();
		else this.#removeViewer();
	}

	#ensureViewer() {
		if (this.#viewer) return;
		this.#viewer = document.importNode(viewerTemplate.content, true).firstElementChild;
		this.#shadow.append(this.#viewer);
		const $ = (selector) => this.#viewer.querySelector(selector);
		$(".viewer__previous").addEventListener("click", () => this.#show(this.#index - 1));
		$(".viewer__next").addEventListener("click", () => this.#show(this.#index + 1));
		$(".viewer__close").addEventListener("click", () => this.#viewer.close());
		$(".viewer__caption-toggle").addEventListener("click", () => this.#expandCaption(!$(".viewer__caption-text").classList.contains("is-expanded")));
		this.#viewer.addEventListener("close", this.#closeHandler);
		// Keydown reaches the dialog from whichever control has focus, the close button included.
		this.#viewer.addEventListener("keydown", (event) => {
			const by = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
			if (by) this.#show(this.#index + by);
		});
		// A click on the backdrop lands on the dialog itself.
		this.#viewer.addEventListener("click", (event) => {
			if (event.target === this.#viewer) this.#viewer.close();
		});
	}

	#removeViewer() {
		this.#viewer?.remove();
		this.#viewer = null;
	}

	#clickHandler = (event) => {
		// A click on the image lands on the slotted element, which closest() can't climb out of into
		// this shadow root, so look along the event's path instead.
		const trigger = event.composedPath().find((node) => node.classList?.contains("gallery__trigger"));
		if (!trigger) return;
		this.#show(Number(trigger.dataset.index));
		this.#bodyOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		this.#viewer.showModal();
	};

	// Steps past either end wrap round to the other.
	#show(index) {
		const count = this.#items.length;
		this.#index = ((index % count) + count) % count;
		// A copy, so the grid keeps its own. The grid's crop does not apply to the full view, and the
		// caption moves to its own line below.
		const copy = this.#items[this.#index].cloneNode(true);
		const captionEl = copy.querySelector('[slot="caption"]');
		const captionText = captionEl?.textContent.trim() ?? "";
		captionEl?.remove();
		for (const el of [copy, ...copy.querySelectorAll("[ratio]")]) el.removeAttribute("ratio");
		this.#viewer.querySelector(".viewer__stage").replaceChildren(copy);
		this.#viewer.querySelector(".viewer__pager").textContent = `${this.#index + 1} / ${count}`;
		this.#viewer.querySelector(".viewer__caption").hidden = !captionText;
		this.#viewer.querySelector(".viewer__caption-text").textContent = captionText;
		this.#viewer.querySelector(".viewer__caption-toggle").hidden = captionText.length <= CAPTION_LIMIT;
		this.#expandCaption(false);
	}

	#expandCaption(expanded) {
		this.#viewer.querySelector(".viewer__caption-text").classList.toggle("is-expanded", expanded);
		const toggle = this.#viewer.querySelector(".viewer__caption-toggle");
		toggle.setAttribute("aria-expanded", String(expanded));
		toggle.textContent = expanded ? "Show less" : "Show more";
	}

	// Send focus to the image that was opened, and give the page its scroll back.
	#closeHandler = () => {
		document.body.style.overflow = this.#bodyOverflow;
		this.#viewer.querySelector(".viewer__stage").replaceChildren();
		this.#list.querySelector(`.gallery__trigger[data-index="${this.#index}"]`)?.focus();
	};
}

if (!customElements.get("ycl-image-gallery")) customElements.define("ycl-image-gallery", ImageGallery);
