import * as Input from "../../input.js";
import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const checkboxTemplate = document.createElement("template");
checkboxTemplate.innerHTML = `
	<div class="form-item--checkbox__item">
		<label class="form-item--checkbox__label"><input class="form-item--checkbox__input" type="checkbox" /> <slot></slot></label>
	</div>
`;

// One checkbox; group several inside a <fieldset> with a <legend>, as the Twig template does.
export class Checkbox extends HTMLElement {
	#shadow;
	#connected = false;
	#defaultChecked = false;
	#formDisabled = false;
	static formAssociated = true;

	static get observedAttributes() {
		return ["checked", "disabled", "required", "value"];
	}

	constructor() {
		super();
		this.internals_ = this.attachInternals();
		this.#shadow = this.attachShadow({ mode: "closed", delegatesFocus: true });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(checkboxTemplate.content, true));
		this.input = this.#shadow.querySelector("input");
		this.input.addEventListener("change", this.changeHandler);
	}

	connectedCallback() {
		// The checked attribute is the live state, so remember where it started for form resets.
		if (!this.#connected) this.#defaultChecked = this.checked;
		this.#connected = true;
		this.update();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this.update();
	}

	formResetCallback() {
		this.checked = this.#defaultChecked;
	}

	formDisabledCallback(disabled) {
		this.#formDisabled = disabled;
		this.update();
	}

	// `input` is composed and already escapes the shadow root; `change` isn't, so it's re-fired.
	changeHandler = () => {
		this.checked = this.input.checked;
		this.dispatchEvent(new Event("change", { bubbles: true }));
	};

	update() {
		this.input.checked = this.checked;
		this.input.disabled = this.disabled || this.#formDisabled;
		this.input.required = this.required;
		this.input.value = this.value;
		// Like a native checkbox, it only contributes to the form data while checked.
		this.internals_.setFormValue(this.checked ? this.value : null);
		// A disabled input has no validation message, and setValidity throws on a flag without one.
		if (this.input.disabled) this.internals_.setValidity({});
		else Input.validityHandler.call(this);
	}

	get form() { return this.internals_.form; }

	get checked() { return this.hasAttribute("checked"); }
	set checked(value) {
		if (value) this.setAttribute("checked", "");
		else this.removeAttribute("checked");
	}

	get disabled() { return this.hasAttribute("disabled"); }
	set disabled(value) {
		if (value) this.setAttribute("disabled", "");
		else this.removeAttribute("disabled");
	}

	get required() { return this.hasAttribute("required"); }
	set required(value) {
		if (value) this.setAttribute("required", "");
		else this.removeAttribute("required");
	}

	get value() { return this.getAttribute("value") ?? "on"; }
	set value(value) { this.setAttribute("value", value); }

	get name() { return this.getAttribute("name"); }
	set name(value) { this.setAttribute("name", value); }
}

customElements.define("ycl-checkbox", Checkbox);
