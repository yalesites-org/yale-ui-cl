import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const radioTemplate = document.createElement("template");
radioTemplate.innerHTML = `
	<div class="form-item--radio__item">
		<label class="form-item--radio__label"><input class="form-item--radio__input radio" type="radio" /> <slot></slot></label>
	</div>
`;

const nextKeys = ["ArrowDown", "ArrowRight"];
const previousKeys = ["ArrowUp", "ArrowLeft"];

// Each radio's <input> lives in its own shadow root, so the browser can't group them. Instead,
// radios group the way native ones do (same name, same form owner, same DOM tree) and the group
// behaviour is rebuilt here: one checked at a time, arrow keys, a single tab stop, group-level
// required validity and set position. Wrap a group in a <fieldset> with a <legend>.
export class Radio extends HTMLElement {
	#shadow;
	#root;
	#connected = false;
	#defaultChecked = false;
	#formDisabled = false;
	static formAssociated = true;

	static get observedAttributes() {
		return ["checked", "disabled", "required", "value", "name"];
	}

	constructor() {
		super();
		this.internals_ = this.attachInternals();
		this.#shadow = this.attachShadow({ mode: "closed", delegatesFocus: true });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(radioTemplate.content, true));
		this.input = this.#shadow.querySelector("input");
		this.input.addEventListener("change", this.changeHandler);
		this.input.addEventListener("keydown", this.keydownHandler);
	}

	connectedCallback() {
		// The checked attribute is the live state, so remember where it started for form resets.
		if (!this.#connected) this.#defaultChecked = this.checked;
		this.#connected = true;
		this.#root = this.getRootNode();
		if (this.checked) this.#uncheckOthers();
		this.#syncGroup();
	}

	disconnectedCallback() {
		this.#syncGroupByName(this.name, this.#root);
		this.#root = null;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "checked" && this.checked) this.#uncheckOthers();
		if (name === "name") this.#syncGroupByName(oldValue, this.#root);
		this.#syncGroup();
	}

	formResetCallback() {
		this.checked = this.#defaultChecked;
	}

	formDisabledCallback(disabled) {
		this.#formDisabled = disabled;
		this.#syncGroup();
	}

	// `input` is composed and already escapes the shadow root; `change` isn't, so it's re-fired.
	changeHandler = () => {
		this.checked = true;
		this.dispatchEvent(new Event("change", { bubbles: true }));
	};

	keydownHandler = (event) => {
		const step = nextKeys.includes(event.key) ? 1 : previousKeys.includes(event.key) ? -1 : 0;
		if (!step) return;
		event.preventDefault();
		const enabled = this.#group().filter((radio) => !radio.#isDisabled);
		const next = enabled[(enabled.indexOf(this) + step + enabled.length) % enabled.length];
		if (!next || next === this) return;
		next.checked = true;
		next.focus();
		next.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
		next.dispatchEvent(new Event("change", { bubbles: true }));
	};

	get #isDisabled() {
		return this.disabled || this.#formDisabled;
	}

	#group() {
		if (!this.isConnected || !this.name) return [this];
		const form = this.form;
		return [...this.getRootNode().querySelectorAll("ycl-radio")].filter(
			(radio) => radio instanceof Radio && radio.name === this.name && radio.form === form,
		);
	}

	#uncheckOthers() {
		this.#group().forEach((radio) => {
			if (radio !== this) radio.checked = false;
		});
	}

	// Brings the rest of a group this radio is leaving (removed or renamed) up to date.
	#syncGroupByName(name, root) {
		if (!name || !root) return;
		const remaining = [...root.querySelectorAll("ycl-radio")].find(
			(radio) => radio !== this && radio instanceof Radio && radio.name === name,
		);
		remaining?.#syncGroup();
	}

	#syncGroup() {
		const group = this.#group();
		const required = group.some((radio) => radio.required);
		const anyChecked = group.some((radio) => radio.checked);
		// Like a native group, Tab lands on the checked radio, or the first enabled one if none is.
		const tabStop = group.find((radio) => radio.checked && !radio.#isDisabled)
			?? group.find((radio) => !radio.#isDisabled);
		group.forEach((radio, index) => {
			const input = radio.input;
			input.checked = radio.checked;
			input.disabled = radio.#isDisabled;
			input.value = radio.value;
			input.tabIndex = radio === tabStop ? 0 : -1;
			input.setAttribute("aria-posinset", String(index + 1));
			input.setAttribute("aria-setsize", String(group.length));
			radio.internals_.setFormValue(radio.checked ? radio.value : null);
			// Required applies to the group: any checked radio satisfies it for all of them. The
			// unchecked inner input supplies the browser's own localised message. Disabled radios
			// are barred from validation (and setValidity throws without a message).
			input.required = required;
			if (required && !anyChecked && !radio.#isDisabled) {
				radio.internals_.setValidity({ valueMissing: true }, input.validationMessage || "Please select one of these options.", input);
			} else {
				radio.internals_.setValidity({});
			}
		});
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

customElements.define("ycl-radio", Radio);
