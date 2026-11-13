import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./image-gallery.css?inline";
import "../../01-atoms/button/Button.js";
import "../../02-molecules/modal/Modal.js";

const galleryTemplate = document.createElement("template");
galleryTemplate.innerHTML = `<ul class="gallery__list"></ul>`;

// The viewer is built once, the first time the gallery is made interactive. It sits in the modal's
// default slot; the heading carries the position and is a polite live region so a screen reader
// hears it change as the person steps through.
const viewerTemplate = document.createElement("template");
viewerTemplate.innerHTML = `
	<ycl-modal>
		<span slot="heading" aria-live="polite"></span>
		<div class="gallery__viewer">
			<ycl-button class="gallery__previous" label="Previous image" variant="outline">Previous</ycl-button>
			<div class="gallery__stage"></div>
			<ycl-button class="gallery__next" label="Next image" variant="outline">Next</ycl-button>
		</div>
	</ycl-modal>
`;

/**
 * A grid of images. Add `interactive` to open each image in a viewer with previous and next buttons.
 * Every child is one item: use a ycl-image (or a plain `<img>`), or a ycl-image-block when the item
 * has a caption. Each image needs alt text.
 * @attr {string} label - Accessible name of the list of images.
 * @attr {"2"|"3"|"4"} columns - Columns from the medium breakpoint up. Defaults to 3.
 * @attr {boolean} interactive - Opens each image in a viewer dialog.
 * @slot - The items.
 */
export class ImageGallery extends HTMLElement {
	#shadow;
	#list;
	#observer;
	#items = [];
	#modal = null;
	#index = 0;

	static get observedAttributes() {
		return ["label", "interactive"];
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
		} else if (this.isConnected) {
			this.#build();
		}
	}

	/** Whether each image opens in a viewer. Reflects the interactive attribute. */
	get interactive() { return this.hasAttribute("interactive"); }
	set interactive(value) { this.toggleAttribute("interactive", Boolean(value)); }

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
		if (this.#modal) return;
		this.#modal = document.importNode(viewerTemplate.content, true).firstElementChild;
		this.#shadow.append(this.#modal);
		this.#modal.addEventListener("close", this.#closeHandler);
		const viewer = this.#modal.querySelector(".gallery__viewer");
		viewer.querySelector(".gallery__previous").addEventListener("click", (event) => this.#step(-1, event.currentTarget));
		viewer.querySelector(".gallery__next").addEventListener("click", (event) => this.#step(1, event.currentTarget));
		// On the modal, not the viewer: a freshly opened dialog focuses its close button, which is
		// outside the viewer, and keydown still reaches the host from there.
		this.#modal.addEventListener("keydown", (event) => {
			const by = { ArrowLeft: -1, ArrowRight: 1 }[event.key];
			if (!by) return;
			const from = event.composedPath().find((node) => node.classList?.contains("gallery__previous") || node.classList?.contains("gallery__next"));
			this.#step(by, from);
		});
	}

	#removeViewer() {
		this.#modal?.remove();
		this.#modal = null;
	}

	#clickHandler = (event) => {
		// A click on the image lands on the slotted element, which closest() can't climb out of into
		// this shadow root, so look along the event's path instead.
		const trigger = event.composedPath().find((node) => node.classList?.contains("gallery__trigger"));
		if (!trigger) return;
		this.#show(Number(trigger.dataset.index));
		this.#modal.show();
	};

	#step(by, from) {
		this.#show(this.#index + by);
		// A button that just disabled itself would drop focus, so hand it to the other one.
		if (from?.hasAttribute("disabled")) {
			const other = from.classList.contains("gallery__next") ? ".gallery__previous" : ".gallery__next";
			this.#modal.querySelector(other).focus();
		}
	}

	#show(index) {
		if (index < 0 || index >= this.#items.length) return;
		this.#index = index;
		// A copy, so the grid keeps its own. The grid's crop does not apply to the full view.
		const copy = this.#items[index].cloneNode(true);
		for (const el of [copy, ...copy.querySelectorAll("[ratio]")]) el.removeAttribute("ratio");
		this.#modal.querySelector(".gallery__stage").replaceChildren(copy);
		this.#modal.querySelector('[slot="heading"]').textContent = `Image ${index + 1} of ${this.#items.length}`;
		this.#modal.querySelector(".gallery__previous").toggleAttribute("disabled", index === 0);
		this.#modal.querySelector(".gallery__next").toggleAttribute("disabled", index === this.#items.length - 1);
	}

	// Modal puts focus back on the element that was focused when it opened, which for a closed
	// shadow root is this host. Send it to the image that was opened instead.
	#closeHandler = () => {
		this.#modal.querySelector(".gallery__stage").replaceChildren();
		this.#list.querySelector(`.gallery__trigger[data-index="${this.#index}"]`)?.focus();
	};
}

if (!customElements.get("ycl-image-gallery")) customElements.define("ycl-image-gallery", ImageGallery);
