import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./modal.css?inline";

// Font Awesome Free "xmark" (CC BY 4.0), decorative only; the button carries the label
const closeIcon = `<svg class="modal__close-icon" viewBox="0 0 384 512" aria-hidden="true" focusable="false"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>`;

// A native modal <dialog> provides the backdrop, top-layer stacking, inert background (which
// keeps focus inside) and Escape to close. The container fills the dialog so a click whose target
// is the <dialog> itself can only have landed on the backdrop.
const modalTemplate = document.createElement("template");
modalTemplate.innerHTML = `
	<dialog class="modal" aria-labelledby="title">
		<div class="modal__container">
			<div class="modal__header">
				<div class="modal__title" id="title"><slot name="heading"></slot></div>
				<button class="modal__close" type="button" aria-label="Close dialog">${closeIcon}</button>
			</div>
			<div class="modal__content"><slot></slot></div>
		</div>
	</dialog>
`;

export class Modal extends HTMLElement {
	#shadow;
	#dialog;
	#opener = null;
	#bodyOverflow = "";

	static get observedAttributes() {
		return ["open"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "modal")];
		this.#shadow.appendChild(document.importNode(modalTemplate.content, true));
		this.#dialog = this.#shadow.querySelector("dialog");
		this.#shadow.querySelector(".modal__close").addEventListener("click", () => this.close());
		// Checking where the press started too stops a text selection dragged out of the
		// container from closing the modal.
		let pressedBackdrop = false;
		this.#dialog.addEventListener("pointerdown", (event) => {
			pressedBackdrop = event.target === this.#dialog;
		});
		this.#dialog.addEventListener("click", (event) => {
			if (pressedBackdrop && event.target === this.#dialog) this.close();
		});
		// Fires however the dialog closed, including Escape.
		this.#dialog.addEventListener("close", this.#handleClose);
	}

	connectedCallback() {
		this.#sync();
	}

	disconnectedCallback() {
		if (this.#dialog.open) this.#dialog.close();
	}

	// The open attribute is the single source of truth; the dialog follows it.
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this.#sync();
	}

	// showModal() throws on a disconnected element, so an initial open attribute waits for
	// connectedCallback.
	#sync() {
		if (!this.isConnected) return;
		if (this.open && !this.#dialog.open) {
			this.#opener = document.activeElement;
			this.#bodyOverflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			this.#dialog.showModal();
			this.dispatchEvent(new Event("open"));
		} else if (!this.open && this.#dialog.open) {
			this.#dialog.close();
		}
	}

	#handleClose = () => {
		document.body.style.overflow = this.#bodyOverflow;
		this.open = false;
		if (this.#opener?.isConnected) this.#opener.focus();
		this.#opener = null;
		// The dialog's own close event doesn't cross the closed shadow root.
		this.dispatchEvent(new Event("close"));
	};

	show() { this.open = true; }
	close() { this.open = false; }

	get open() { return this.hasAttribute("open"); }
	set open(value) {
		if (value) this.setAttribute("open", "");
		else this.removeAttribute("open");
	}
}

if (!customElements.get("ycl-modal")) customElements.define("ycl-modal", Modal);
