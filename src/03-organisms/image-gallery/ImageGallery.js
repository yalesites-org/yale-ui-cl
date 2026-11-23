import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./image-gallery.css?inline";
import { iconSvg } from "../../01-atoms/icons/icons.js";
import "../../01-atoms/headings/Heading.js";

// Marks a thumbnail as one that opens a larger view. Decorative: the button's name comes from the image.
const expandIcon = iconSvg("arrows-maximize", "gallery__expand");
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
		<button class="viewer__previous viewer__step" type="button" aria-label="Previous image">${iconSvg("angle-right", "viewer__step-icon")}</button>
		<div class="viewer__stage"></div>
		<button class="viewer__next viewer__step" type="button" aria-label="Next image">${iconSvg("angle-right", "viewer__step-icon")}</button>
		<div class="viewer__caption" hidden>
			<div class="viewer__caption-heading"></div>
			<div class="viewer__caption-text"></div>
			<button class="viewer__caption-toggle" type="button" aria-expanded="false" hidden>Show more</button>
		</div>
		<p class="viewer__pager" aria-live="polite"></p>
	</dialog>
`;

// Caption markup is trusted, the same as the rest of the item: this does not sanitize it. It keeps the
// documented tags and unwraps the others, so a stray block element cannot break the viewer's layout.
const captionTags = new Set(["A", "STRONG", "EM", "BR", "P"]);
const dropTags = new Set(["SCRIPT", "STYLE", "TEMPLATE"]);
function captionNodes(source) {
	const out = [];
	for (const node of source.childNodes) {
		if (node.nodeType === Node.TEXT_NODE) out.push(node.cloneNode());
		else if (node.nodeType === Node.ELEMENT_NODE && !dropTags.has(node.tagName)) {
			if (captionTags.has(node.tagName)) {
				const copy = node.cloneNode(false);
				copy.append(...captionNodes(node));
				out.push(copy);
			} else {
				out.push(...captionNodes(node));
			}
		}
	}
	return out;
}

/**
 * A grid of images: 2 across on small screens, 3 from the medium breakpoint, 4 from the large.
 * Add `interactive` to open each image in a full-screen viewer with previous and next buttons that
 * wrap around, a numbered pager and the image's caption.
 * Every child is one item: use a ycl-image (or a plain `<img>`), or a ycl-image-block when the item
 * has a caption; captions show in the viewer only. Each image needs alt text.
 * An item can also carry a caption heading: an element with `slot="caption-heading"` (its text becomes an h2 in
 * the viewer, and its `id`, if any, is kept so a link can target it). Caption markup is copied as written, keeping
 * `a`, `strong`, `em`, `br` and `p`; it is trusted and not sanitized, so clean untrusted input first.
 * A link can open the viewer on one photo: a URL hash that is the `id` of that photo's caption heading, for example
 * `#sterling`. It works at load and when the hash changes later, and switches photo if the viewer is open. Only
 * photos whose caption heading has an `id` can be linked. The component only reads the hash: it never writes or
 * clears it, so the hash stays in the URL after the viewer closes, and clicking the same link again does nothing.
 * @attr {string} label - Accessible name of the list of images.
 * @attr {boolean} narrow - Keeps 2 across at every width, for a narrow column.
 * @attr {boolean} interactive - Opens each image in a full-screen viewer.
 * @attr {string} heading - Optional visible heading shown above the grid. It also names the viewer; without it the viewer is named "Image viewer".
 * @attr {"1"|"2"|"3"|"4"|"5"|"6"} heading-level - The heading level, so it fits the page outline. Defaults to 2.
 * @slot - The items.
 */
export class ImageGallery extends HTMLElement {
	#shadow;
	#list;
	#heading = null;
	#observer;
	#items = [];
	#viewer = null;
	#bodyOverflow = "";
	#index = 0;

	static get observedAttributes() {
		return ["label", "interactive", "narrow", "heading", "heading-level"];
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
		window.addEventListener("hashchange", this.#hashHandler);
		// A hash already in the URL opens the viewer once the page has parsed, so every item is there.
		if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", this.#hashHandler, { once: true });
		else this.#openFromHash();
	}

	disconnectedCallback() {
		this.#observer.disconnect();
		window.removeEventListener("hashchange", this.#hashHandler);
		document.removeEventListener("DOMContentLoaded", this.#hashHandler);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "label") {
			if (newValue) this.#list.setAttribute("aria-label", newValue);
			else this.#list.removeAttribute("aria-label");
		} else if (name === "interactive" && this.isConnected) {
			this.#build();
		} else if (name === "heading" || name === "heading-level") {
			this.#renderHeading();
		}
	}

	#renderHeading() {
		const text = this.getAttribute("heading")?.trim();
		if (text) {
			if (!this.#heading) {
				this.#heading = document.createElement("ycl-heading");
				this.#shadow.prepend(this.#heading);
			}
			this.#heading.textContent = text;
			this.#heading.setAttribute("level", this.getAttribute("heading-level") || "2");
		} else {
			this.#heading?.remove();
			this.#heading = null;
		}
		this.#viewer?.setAttribute("aria-label", text || "Image viewer");
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
				trigger.insertAdjacentHTML("beforeend", expandIcon);
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
		this.#renderHeading();
		this.#shadow.append(this.#viewer);
		const $ = (selector) => this.#viewer.querySelector(selector);
		$(".viewer__previous").addEventListener("click", () => this.#show(this.#index - 1));
		$(".viewer__next").addEventListener("click", () => this.#show(this.#index + 1));
		$(".viewer__close").addEventListener("click", () => this.#viewer.close());
		$(".viewer__caption-toggle").addEventListener("click", () => this.#expandCaption(!$(".viewer__caption-text").classList.contains("is-expanded")));
		this.#viewer.addEventListener("close", this.#closeHandler);
		// Fires when the dialog first opens (it has no size until then) and on every resize.
		new ResizeObserver(() => this.#updateCaptionToggle()).observe(this.#viewer);
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
		this.#open(Number(trigger.dataset.index));
	};

	#open(index) {
		this.#show(index);
		if (this.#viewer.open) return;
		this.#bodyOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		this.#viewer.showModal();
		// The caption has a size only now the dialog is open.
		this.#updateCaptionToggle();
	}

	#hashHandler = () => this.#openFromHash();

	// A link to a photo is the id of its caption heading, as in YaleSites. The heading ends up in this
	// shadow root, so the page's getElementById cannot reach it: match the id against the items instead.
	// The component only reads the hash. It never writes or clears it.
	#openFromHash() {
		if (!this.interactive || !this.#viewer) return;
		let id;
		try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
		if (!id) return;
		const index = this.#items.findIndex((item) => item.querySelector('[slot="caption-heading"]')?.id === id);
		if (index < 0) return;
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		this.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
		this.#open(index);
		this.#expandCaption(true);
		this.#viewer.querySelector(".viewer__caption-title")?.focus();
	}

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
		const headingEl = copy.querySelector('[slot="caption-heading"]');
		const headingText = headingEl?.textContent.trim() ?? "";
		const headingId = headingEl?.id;
		headingEl?.remove();
		for (const el of [copy, ...copy.querySelectorAll("[ratio]")]) el.removeAttribute("ratio");
		this.#viewer.querySelector(".viewer__stage").replaceChildren(copy);
		this.#viewer.querySelector(".viewer__pager").textContent = `${this.#index + 1} / ${count}`;
		this.#viewer.querySelector(".viewer__caption").hidden = !captionText && !headingText;
		this.#viewer.querySelector(".viewer__caption-heading").replaceChildren(...this.#headingNodes(headingText, headingId));
		this.#viewer.querySelector(".viewer__caption-text").replaceChildren(...(captionText ? captionNodes(captionEl) : []));
		this.#expandCaption(false);
		this.#updateCaptionToggle();
	}

	#headingNodes(text, id) {
		if (!text) return [];
		const heading = document.createElement("h2");
		heading.className = "viewer__caption-title";
		heading.textContent = text;
		if (id) heading.id = id;
		heading.tabIndex = -1;
		return [heading];
	}

	// Offer Show more only when the two-line clamp hides text. That depends on the viewer's width,
	// so it is measured, and again whenever the viewer is resized. An open caption keeps its toggle.
	#updateCaptionToggle() {
		const text = this.#viewer.querySelector(".viewer__caption-text");
		if (text.classList.contains("is-expanded")) return;
		this.#viewer.querySelector(".viewer__caption-toggle").hidden = text.scrollHeight <= text.clientHeight;
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
