import * as Util from "../../utility.js"
import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const textInputTemplate = document.createElement("template");
textInputTemplate.innerHTML = `
  	<div class="form-item">
		<label for="input" class="form-item__label"><slot name="label"></slot></label>
		<div class="form-item__inner"><input id="input" class="form-item__textfield" type="text" aria-describedby="instructions errors" /></div>
		<div class="form-item__description" id="instructions"><slot name="instructions"></slot></div>
		<div class="form-item__error-text" id="errors"><slot name="errors"></slot></div>
	</div>
`;

export class TextInput extends HTMLElement {
	#shadow;
	static formAssociated = true;

	static get properties() {
		return {
			name: {
				type: String,
				reflect: true
			},
			value: {
				type: String
			}
		};
	}
	
	static get observedAttributes() {
		return ["class", "placeholder", "name", "autocomplete", "value", "disabled", "valid", "type"];
	}
	
	constructor() {
		super();
		this.internals_ = this.attachInternals();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(textInputTemplate.content, true),);
		this.input = this.#shadow.querySelector("input");
		this.label = this.#shadow.querySelector("label");
		this.errorSlot = this.#shadow.querySelector("slot[name='errors']");
		this.name = name;
		this.required = false;
		this.value = '';
		this.valid = true;
		this.input.addEventListener("input", Util.inputHandler.bind(this));
		this.errorSlot.addEventListener("slotchange", Util.errorHandler.bind(this, "textfield"));
	}
	
	inputHandler = () => {
		this.value = this.input.value;
	};
	
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "placeholder") this.input.placeholder = newValue;
		if (name === "class" && newValue === "required") {
			this.input.required = true;
			this.label.classList.add("form-item__label--" + newValue);
		}
		if (name === "name") this.name = newValue;
		if (name === "autocomplete") this.input.autocomplete = newValue;
		if (name === "disabled") this.input.disabled = newValue !== null;
		if (name === "value") this.input.value = newValue;
		if (name === "type") {
			switch (newValue) {
				case "tel":
				case "number":
				case "date":
				case "datetime-local":
				case "email":
				case "text":
					this.input.type = newValue;
					break;
				default: 
					console.warn(newValue + " is not a valid type for the text-input component");
					return;
		}
		}
	}
		
	get placeholder() { return this.getAttribute("placeholder"); }
	get value() { return this.getAttribute("value"); }
	get disabled() { return this.getAttribute("disabled");}
	get autocomplete() { return this.getAttribute("autocomplete");}
	get name() { return this.getAttribute("name"); }
	get type() { return this.getAttribute("type"); }
	
	set placeholder(value) {  this.setAttribute("placeholder", value); }
	set value(text) {  this.setAttribute("value", text); }
	set disabled(value) {
		if (value) this.setAttribute("disabled", "");
		else this.removeAttribute("disabled");
	}
	set autocomplete(value) {  this.setAttribute("autocomplete", value);}
	set name(value) {  this.setAttribute("name", value); }
	set type(value) {  this.setAttribute("type", value) 
	}
		
	
}

customElements.define("text-input", TextInput);
