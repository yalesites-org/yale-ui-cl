import textinputStyles from "./textinput.css?inline";
import baseStyles from "../../styles/base.css?inline";
const sheet = new CSSStyleSheet();
sheet.replaceSync(textinputStyles);
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const textInputTemplate = document.createElement("template");
textInputTemplate.innerHTML = `
  	<div class="form-item">
		<label for="input" class="form-item__label"><slot name="label"></slot></label>
		<input id="input" class="form-item__textfield" type="text" aria-describedby="instructions errors" />
		<div class="form-item__description id="instructions"><slot name="instructions"></slot></div>
		<div class="form-item__error-text id="errors"><slot name="errors"></slot></div>
	</div>
`;

export class TextInput extends HTMLElement {
  #shadow;
  static formAssociated = true;

  static get properties() {
      return {
	name: {type: String, reflect: true},
	value: {type: String}
      };
  }
  static get observedAttributes() {
    return ["class", "placeholder", "name"];
  }

  constructor() {
    super();
    this.internals_ = this.attachInternals();
    this.#shadow = this.attachShadow({ mode: "closed" });
    this.#shadow.adoptedStyleSheets = [baseSheet, sheet];
    this.name = name;
    this.required = false;
    this.value = '';
    this._requuired = false;
    this.#updatePlaceholder();
    this.#updateRequired();
  }

  connectedCallback() {
    this.#shadow.appendChild(
      document.importNode(textInputTemplate.content, true),
    );
    this.#updateRequired();
    this.#updatePlaceholder();
    const slots = this.#shadow.querySelectorAll("slot");
    const input = this.#shadow.querySelector("input");
    const errorIcon = document.createElement("svg");
    errorIcon.classList.add("form-item__error_icon__icon");
    errorIcon.ariaHidden = true;
    errorIcon.innerHTML = `
      <symbol viewBox="0 0 512 512" id="circle-exclamation"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM256 304c13.25 0 24-10.75 24-24v-128C280 138.8 269.3 128 256 128S232 138.8 232 152v128C232 293.3 242.8 304 256 304zM256 337.1c-17.36 0-31.44 14.08-31.44 31.44C224.6 385.9 238.6 400 256 400s31.44-14.08 31.44-31.44C287.4 351.2 273.4 337.1 256 337.1z"></path></symbol>
    `;
    // Is there content in the error slot?
    slots[2].addEventListener("slotchange", () => {
      input.ariaInvalid = true;
      input.classList.add("form-item__textfield--error");
      input.insertAdjacentElement("afterend", errorIcon);
    });
    
    // set the value of the component to the value of the shadow DOM input
    input.addEventListener("input", () => {
      this.value = input.value;
  });
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "placeholder") this.#updatePlaceholder();
    if (name === "class" && newValue === "required") this.#updateRequired();
    if (name === "name") this.name = newValue;
  }

  #updatePlaceholder() {
    const input = this.#shadow.querySelector("input");
    if (!input) return;
    input.placeholder = this.getAttribute("placeholder") ?? "";
    console.log(input);
  }

  #updateRequired() {
    const label = this.#shadow.querySelector("label");
    const input = this.#shadow.querySelector("input");
    if (!label && !input) return;
    const variant = this.classList;
    if (variant) {
      variant.forEach((variant) => {
        label.classList.add("form-item__label--" + variant);
      input.required = true;
      });
  };
  };
}

customElements.define("text-input", TextInput);
