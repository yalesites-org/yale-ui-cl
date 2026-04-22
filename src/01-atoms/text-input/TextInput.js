//import textinputStyles from "./textinput.css?inline";
import baseStyles from "../../styles/base.css?inline";
//const sheet = new CSSStyleSheet();
//sheet.replaceSync(textinputStyles);
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const textInputTemplate = document.createElement("template");
textInputTemplate.innerHTML = `
  	<div class="form-item">
		<label for="input" class="form-item__label"><slot name="label"></slot></label>
		<input id="input" class="form-item__textfield" type="text" aria-describedby="instructions errors" />
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
		return ["class", "placeholder", "name", "autocomplete", "value", "disabled",];
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
		this.input.addEventListener("input", this.inputHandler);
		this.errorSlot.addEventListener("slotchange", this.errorHandler);
	}
	
	inputHandler = () => {
		this.value = this.input.value;
	};
	
	errorHandler = () => {
		const errorSpan = this.errorSlot.assignedElements();

		//Create the error icon SVG
		const errorIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		const errorIconPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
		errorIconPath.setAttribute("d", "M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 304c13.25 0 24-10.75 24-24v-128C280 138.8 269.3 128 256 128S232 138.8 232 152v128C232 293.3 242.8 304 256 304zM256 337.1c-17.36 0-31.44 14.08-31.44 31.44C224.6 385.9 238.6 400 256 400s31.44-14.08 31.44-31.44C287.4 351.2 273.4 337.1 256 337.1z");
		errorIcon.appendChild(errorIconPath);
		errorIcon.setAttribute("viewBox", "0 0 512 512");
		errorIcon.classList.add("form-item__error_icon__icon");
		errorIcon.ariaHidden = true;
		
			// Error slot is empty
			if (!errorSpan[0].innerHTML) {
				this.input.ariaInvalid = false;
				this.input.classList.remove("form-item__textfield--error");
				return;
			};
			
			// There's content in the slot
			this.input.ariaInvalid = true;
			this.input.classList.add("form-item__textfield--error");
			this.input.insertAdjacentElement("afterend", errorIcon);
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
		
	}
	
	// Getters and setters 
	
	get placeholder() { return this.getAttribute("placeholder"); }
	get value() { return this.getAttribute("value"); }
	get disabled() { return this.getAttribute("disabled");}
	get autocomplete() { return this.getAttribute("autocomplete");}
	get name() { return this.getAttribute("name"); }
	
	set placeholder(value) { return this.setAttribute("placeholder", value); }
	set value(text) { return this.setAttribute("value", text); }
	set disabled(value) {
		if (value) this.setAttribute("disabled", "");
		else this.removeAttribute("disabled");
	}
	set autocomplete(value) { return this.setAttribute("autocomplete", value);}
	set name(value) { return this.setAttribute("name", value); }
	
		
	
}

customElements.define("text-input", TextInput);
