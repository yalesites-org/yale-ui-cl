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
		this.input.addEventListener("input", this.inputHandler);
		this.errorSlot.addEventListener("slotchange", this.errorHandler());
	}
	
	inputHandler = () => {
		this.value = this.input.value;
	};
	
	errorHandler = () => {
		const errorSpan = this.errorSlot.assignedElements();
		if (!errorSpan) return;
		//const errorIcon = Util.createErrorIcon();
		const formInner = this.#shadow.querySelector(".form-item__inner");
		
			// Error slot is empty
			if (!errorSpan[0].innerHTML) {
				this.input.ariaInvalid = false;
				this.valid = true;
				this.input.classList.remove("form-item__textfield--error");
				formInner.classList.remove("form-item__inner__with-icon");
				return;
			} else if (errorSpan[0]) {			
			// There's content in the slot
			this.input.ariaInvalid = true;
			this.valid = false;
			this.input.classList.add("form-item__textfield--error");
			formInner.classList.add("form-item__inner__with-icon");
			//this.input.insertAdjacentElement("afterend", errorIcon);
		}
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
	
	set placeholder(value) { return this.setAttribute("placeholder", value); }
	set value(text) { return this.setAttribute("value", text); }
	set disabled(value) {
		if (value) this.setAttribute("disabled", "");
		else this.removeAttribute("disabled");
	}
	set autocomplete(value) { return this.setAttribute("autocomplete", value);}
	set name(value) { return this.setAttribute("name", value); }
	set type(value) { return this.setAttribute("type", value) 
	}
		
	
}

customElements.define("text-input", TextInput);
