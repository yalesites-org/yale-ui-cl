import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./button.css?inline";
import ctaStyles from "../cta/cta.css?inline";
import * as Util from "../../utility.js";

// Font Awesome Free "angle-down" (CC BY 4.0), decorative only
const angleDownIcon = (className) => `<svg class="${className}" viewBox="0 0 448 512" aria-hidden="true" focusable="false"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>`;

const buttonTemplate = document.createElement("template");
buttonTemplate.innerHTML = `<button class="button cta" type="button"><slot></slot></button>`;

// A <button> styled as a CTA, or an <a> when given an href (matching yds-control.twig). Dropdowns
// are always buttons, whatever the href. CTA variants come from the class attribute, as on
// cta-link (e.g. class="filled radius-pill").
export class Button extends HTMLElement {
	#shadow;
	#internals;
	#control;
	#formDisabled = false;
	static formAssociated = true;

	static get observedAttributes() {
		return ["href", "type", "disabled", "expanded", "label", "control-type", "class"];
	}

	constructor() {
		super();
		this.#internals = this.attachInternals();
		this.#shadow = this.attachShadow({ mode: "closed", delegatesFocus: true });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(ctaStyles, "cta"), componentSheet(componentStyles, "button")];
		this.#shadow.appendChild(document.importNode(buttonTemplate.content, true));
		this.#control = this.#shadow.querySelector(".button");
		// Listening on the shadow root rather than the control survives swapping <button> for <a>.
		this.#shadow.addEventListener("click", this.#clickHandler);
		// Clicks on slotted text can still reach listeners outside a disabled button.
		this.addEventListener("click", (event) => {
			if (this.#isDisabled && !this.#isLink) event.stopImmediatePropagation();
		}, { capture: true });
		this.#render();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this.#render();
	}

	formDisabledCallback(disabled) {
		this.#formDisabled = disabled;
		this.#render();
	}

	get #isLink() {
		return this.hasAttribute("href") && this.controlType !== "dropdown";
	}

	get #isDisabled() {
		return this.disabled || this.#formDisabled;
	}

	// A button inside a shadow root can't submit or reset the light-DOM form it sits in, so the
	// host does it on the button's behalf.
	#clickHandler = (event) => {
		if (this.#isLink || this.#isDisabled || event.defaultPrevented) return;
		const form = this.#internals.form;
		if (!form) return;
		if (this.type === "submit") form.requestSubmit();
		else if (this.type === "reset") form.reset();
	};

	#render() {
		const tag = this.#isLink ? "a" : "button";
		if (this.#control.localName !== tag) {
			const next = document.createElement(tag);
			next.append(...this.#control.childNodes);
			this.#control.replaceWith(next);
			this.#control = next;
		}
		const control = this.#control;

		control.className = "button cta";
		Util.addVariant(this.getAttribute("class"), control, "cta");

		if (this.#isLink) {
			control.href = this.href;
		} else {
			control.type = "button";
			control.disabled = this.#isDisabled;
			// expanded is tri-state: absent means "not a toggle", so no aria-expanded at all.
			if (this.expanded === "true" || this.expanded === "false") control.setAttribute("aria-expanded", this.expanded);
			else control.removeAttribute("aria-expanded");
		}

		if (this.label) control.setAttribute("aria-label", this.label);
		else control.removeAttribute("aria-label");

		const icon = control.querySelector(".button__icon");
		if (this.controlType === "dropdown" && !icon) control.insertAdjacentHTML("beforeend", angleDownIcon("button__icon"));
		else if (this.controlType !== "dropdown" && icon) icon.remove();
	}

	get form() { return this.#internals.form; }

	get href() { return this.getAttribute("href"); }
	set href(value) {
		if (value == null) this.removeAttribute("href");
		else this.setAttribute("href", value);
	}

	get type() {
		const type = this.getAttribute("type");
		return type === "submit" || type === "reset" ? type : "button";
	}
	set type(value) { this.setAttribute("type", value); }

	get disabled() { return this.hasAttribute("disabled"); }
	set disabled(value) {
		if (value) this.setAttribute("disabled", "");
		else this.removeAttribute("disabled");
	}

	get expanded() { return this.getAttribute("expanded"); }
	set expanded(value) {
		if (value == null) this.removeAttribute("expanded");
		else this.setAttribute("expanded", String(value));
	}

	get label() { return this.getAttribute("label"); }
	set label(value) {
		if (value == null) this.removeAttribute("label");
		else this.setAttribute("label", value);
	}

	get controlType() { return this.getAttribute("control-type"); }
	set controlType(value) {
		if (value == null) this.removeAttribute("control-type");
		else this.setAttribute("control-type", value);
	}
}

if (!customElements.get("ycl-button")) customElements.define("ycl-button", Button);
