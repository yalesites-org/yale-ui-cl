import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./selectinput.css?inline";
import * as Input from "../../input.js";

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
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "select-input")];
		this.#shadow.appendChild(document.importNode(selectInputTemplate.content, true),);
		this.input = this.#shadow.querySelector("select");
		this.label = this.#shadow.querySelector("label");
		this.errorSlot = this.#shadow.querySelector("slot[name='errors']");
		this.input.addEventListener("change", Input.inputHandler.bind(this));
		this.errorSlot.addEventListener("slotchange", Input.errorHandler.bind(this, "select"));
		// Options added to the light DOM after connection still need to be moved into the <select>
		this.optionObserver = new MutationObserver(() => this.syncOptions());
	}

	connectedCallback() {
		this.syncOptions();
		this.optionObserver.observe(this, { childList: true });
	};

	disconnectedCallback() {
		this.optionObserver.disconnect();
	}

	// Move light-DOM <option>/<optgroup> children into the shadow <select>, preserving their order
	syncOptions() {
		const options = this.querySelectorAll(":scope > option, :scope > optgroup");
		if (options.length) this.input.append(...options);

		// The value attribute may have been set before its option existed, so re-apply it
		if (this.value !== null) this.input.value = this.value;
		this.internals_.setFormValue(this.input.value);
		Input.validityHandler.call(this);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		Input.attributeHandler.call(this, name, newValue);
	}
		
	get placeholder() { return this.getAttribute("placeholder"); }
	get value() { return this.getAttribute("value"); }
	get disabled() { return this.getAttribute("disabled");}
	get autocomplete() { return this.getAttribute("autocomplete");}
	get name() { return this.getAttribute("name"); }
	get required() { return this.classList.contains("required"); }

	set placeholder(value) { this.setAttribute("placeholder", value); }
	set value(text) { this.setAttribute("value", text); }
	set disabled(value) {
		if (value) this.setAttribute("disabled", "");
		else this.removeAttribute("disabled");
	}
	set autocomplete(value) { this.setAttribute("autocomplete", value);}
	set name(value) { this.setAttribute("name", value); }
	set required(value) { this.classList.toggle("required", Boolean(value)); }
	
		
	
}

if (!customElements.get("select-input")) customElements.define("select-input", SelectInput);
