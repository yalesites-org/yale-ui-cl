import * as Input from "../../input.js";
import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./textarea.css?inline";

const textareaTemplate = document.createElement("template");
textareaTemplate.innerHTML = `
	<div class="form-item">
		<label for="input" class="form-item__label"><slot name="label"></slot></label>
		<div class="form-item__inner"><textarea id="input" class="form-item__textfield form-item__textarea" rows="5" aria-describedby="instructions errors"></textarea></div>
		<div class="form-item__description" id="instructions"><slot name="instructions"></slot></div>
		<div class="form-item__error-text" id="errors"><slot name="errors"></slot></div>
	</div>
`;

// Multi-line counterpart to text-input: same label, instructions, errors and form participation.
export class Textarea extends HTMLElement {
	#shadow;
	static formAssociated = true;

	static get observedAttributes() {
		return ["class", "placeholder", "name", "autocomplete", "value", "disabled", "rows"];
	}

	constructor() {
		super();
		this.internals_ = this.attachInternals();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "textarea")];
		this.#shadow.appendChild(document.importNode(textareaTemplate.content, true));
		this.input = this.#shadow.querySelector("textarea");
		this.label = this.#shadow.querySelector("label");
		this.errorSlot = this.#shadow.querySelector("slot[name='errors']");
		this.valid = true;
		this.input.addEventListener("input", Input.inputHandler.bind(this));
		this.errorSlot.addEventListener("slotchange", Input.errorHandler.bind(this, "textfield"));
	}

	connectedCallback() {
		Input.validityHandler.call(this);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "rows") {
			if (newValue === null) this.input.removeAttribute("rows");
			else this.input.rows = Number(newValue);
			return;
		}
		Input.attributeHandler.call(this, name, newValue);
	}

	get placeholder() { return this.getAttribute("placeholder"); }
	get value() { return this.getAttribute("value"); }
	get disabled() { return this.getAttribute("disabled"); }
	get autocomplete() { return this.getAttribute("autocomplete"); }
	get name() { return this.getAttribute("name"); }
	get rows() { return this.input.rows; }
	get required() { return this.classList.contains("required"); }

	set placeholder(value) { this.setAttribute("placeholder", value); }
	set value(text) { this.setAttribute("value", text); }
	set disabled(value) {
		if (value) this.setAttribute("disabled", "");
		else this.removeAttribute("disabled");
	}
	set autocomplete(value) { this.setAttribute("autocomplete", value); }
	set name(value) { this.setAttribute("name", value); }
	set rows(value) { this.setAttribute("rows", value); }
	set required(value) { this.classList.toggle("required", Boolean(value)); }
}

if (!customElements.get("text-area")) customElements.define("text-area", Textarea);
