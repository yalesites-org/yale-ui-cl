import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./text-copy-button.css?inline";

const FEEDBACK_DURATION = 1700;

const textCopyButtonTemplate = document.createElement("template");
textCopyButtonTemplate.innerHTML = `
	<div class="text-copy-button">
		<span class="pre-text__text"><slot name="text"></slot></span>
		<button class="text-copy-button__button" type="button"><span class="text-copy-button__label"><slot>Copy</slot></span><span class="text-copy-button__feedback" hidden></span></button>
		<span class="visually-hidden" role="status"></span>
	</div>
`;

// Copies the text slotted into "text" to the clipboard. On success it fires a cancelable,
// bubbling `text-copy-button:copied` event (detail: { text, button }); calling preventDefault()
// suppresses the visible label swap so the page can show its own feedback.
export class TextCopyButton extends HTMLElement {
	#shadow;
	#timer;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed", delegatesFocus: true });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "text-copy-button")];
		this.#shadow.appendChild(document.importNode(textCopyButtonTemplate.content, true));
		this.button = this.#shadow.querySelector(".text-copy-button__button");
		this.label = this.#shadow.querySelector(".text-copy-button__label");
		this.feedback = this.#shadow.querySelector(".text-copy-button__feedback");
		this.status = this.#shadow.querySelector("[role='status']");
		this.textSlot = this.#shadow.querySelector("slot[name='text']");
		this.button.addEventListener("click", this.clickHandler);
	}

	disconnectedCallback() {
		clearTimeout(this.#timer);
	}

	get text() {
		return this.textSlot
			.assignedNodes({ flatten: true })
			.map((node) => node.textContent)
			.join("")
			.trim();
	}

	clickHandler = async () => {
		const text = this.text;
		if (!text) return;
		try {
			// navigator.clipboard is undefined outside secure contexts, which lands in the catch.
			await navigator.clipboard.writeText(text);
		} catch {
			this.#showFeedback("Copy failed", true);
			return;
		}
		const copyEvent = new CustomEvent("text-copy-button:copied", {
			bubbles: true,
			composed: true,
			cancelable: true,
			detail: { text, button: this },
		});
		this.#showFeedback("Copied to clipboard", this.dispatchEvent(copyEvent));
	};

	// The visible label swap changes the button's name, which screen readers don't reliably
	// announce, so the message also goes to a status region. That runs even when the swap is
	// cancelled because it has no visual effect.
	#showFeedback(message, swapLabel) {
		clearTimeout(this.#timer);
		this.status.textContent = message;
		if (swapLabel) {
			this.feedback.textContent = message;
			this.feedback.hidden = false;
			this.label.hidden = true;
		}
		// Clearing the status region afterwards lets the same message be announced again next time.
		this.#timer = setTimeout(() => {
			this.status.textContent = "";
			this.feedback.hidden = true;
			this.label.hidden = false;
		}, FEEDBACK_DURATION);
	}
}

if (!customElements.get("ycl-text-copy-button")) customElements.define("ycl-text-copy-button", TextCopyButton);
