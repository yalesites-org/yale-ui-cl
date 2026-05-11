import baseStyles from "../../styles/base.css?inline";
import * as Util from "../../utility.js";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const selectInputTemplate = document.createElement("template");
selectInputTemplate.innerHTML = `
  	<div class="form-item">
		<label for="input" class="form-item__label"><slot name="label"></slot></label>
		<div class="form-item__dropdown">
			<select id="input" class="form-item__select" aria-describedby="instructions errors"></select>
		</div>
		<div class="form-item__description" id="instructions"><slot name="instructions"></slot></div>
		<div class="form-item__error-text" id="errors"><slot name="errors"></slot></div>
	</div>
`;

export class SelectInput extends HTMLElement {
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
		return ["class", "placeholder", "name", "autocomplete", "value", "disabled"];
	}
	
	constructor() {
		super();
		this.internals_ = this.attachInternals();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(selectInputTemplate.content, true),);
		this.input = this.#shadow.querySelector("select");
		this.label = this.#shadow.querySelector("label");
		this.errorSlot = this.#shadow.querySelector("slot[name='errors']");
		this.name = name;
		this.required = false;
		this.value = '';
		this.input.addEventListener("change", this.inputHandler);
		this.errorSlot.addEventListener("slotchange", this.errorHandler(this.errorSlot, this.input, this.#shadow));
		this.host = this.#shadow.getRootNode().host;
		this.options = this.host.querySelectorAll("option");
		if (this.host.querySelector("optgroup")) this.optgroups = this.host.querySelectorAll("optgroup");
		console.log(this.host)
		console.log(this.optgroups)	

	}
	
	inputHandler = () => {
		this.value = this.input.value;
	};
	
	errorHandler = () => {
		const errorSpan = this.errorSlot.assignedElements();
		//const errorIcon = Util.createErrorIcon();

			// Error slot is empty
			if (!errorSpan[0].innerHTML) {
				this.input.ariaInvalid = false;
				this.input.classList.remove("form-item__select--error");
				return;
			};
			
			// There's content in the slot		 
			this.input.ariaInvalid = true;
			this.input.classList.add("form-item__select--error");
			//this.input.insertAdjacentElement("afterend", errorIcon);
		};
		
		connectedCallback() {
			
			if (!this.optgroups) {
				this.input.append(...this.options);
			} else {
				this.input.append(...this.optgroups);
			}
				
				//const optgroups = this.#shadow.querySelectorAll("optgroup");
				//optgroups.forEach((e) => e.append(this.options));

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

customElements.define("select-input", SelectInput);
