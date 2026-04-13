import textinputStyles from "./textinput.css?inline";
import baseStyles from "../../styles/base.css?inline";
const sheet = new CSSStyleSheet();
sheet.replaceSync(textinputStyles);
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const textInputTemplate = document.createElement("template");
textInputTemplate.innerHTML = `
  	<span class="form-item">
		<label for="input" class="form-item__label"><slot name="label"></slot></label>
		<input id="input" class="form-item__textfield type="text" aria-describedby="instructions errors"/>
		<p class="form-item__description id="instructions"><slot name="instructions"></slot></p>
		<p class="form-item__error-text id="errors"><slot name="errors"></slot></p>
	</span>
`;

export class TextInput extends HTMLElement {
  #shadow;
  static formAssociated = true;
  static get observedAttributes() {
    return ["class", "placeholder"];
  }

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "closed" });
    this.#shadow.adoptedStyleSheets = [baseSheet, sheet];
    this.#updatePlaceholder();
  }

  connectedCallback() {
    this.#shadow.appendChild(
      document.importNode(textInputTemplate.content, true),
    );
    //this.#updateVariant();
    this.#updatePlaceholder();
    const slots = this.#shadow.querySelectorAll("slot");
    const input = this.#shadow.querySelector("input");
    console.log(slots);
    slots[2].addEventListener("slotchange", (e) => {
      // Is there content in the error slot?
      input.ariaInvalid = true;
      input.classList.add("form-item__textfield--error");
    });
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "placeholder") this.#updatePlaceholder();
  }

  #updatePlaceholder() {
    const input = this.#shadow.querySelector("input");
    if (!input) return;
    input.placeholder = this.getAttribute("placeholder") ?? "";
    console.log(input);
  }
  #updateVariant() {
    const input = this.#shadow.querySelector("input");
    if (!input) return;
    const variant = this.classList;
    if (variant)
      variant.forEach((variant) => {
        input.classList.add("txt-input--" + variant);
      });
  }
}

customElements.define("text-input", TextInput);
