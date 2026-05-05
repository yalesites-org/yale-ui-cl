import baseStyles from '../../styles/base.css?inline';
import * as Util from '../../utility.js';
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);
const listTemplate = document.createElement('template');
listTemplate.innerHTML = `
  <slot></slot>
`;

export class List extends HTMLElement { #shadow;
  static get observedAttributes() {
    return ["class"];
  }

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'closed' });
	  this.#shadow.appendChild(document.importNode(listTemplate.content, true));
    this.#shadow.adoptedStyleSheets = [baseSheet];
    this.list = this.#shadow.host.querySelector("ul");
    this.listItem = this.#shadow.host.querySelectorAll("li");
    console.log(this.list)


  }

  connectedCallback() {
        
  }

  attributeChangedCallback(name, oldValue, newValue) {
	if (oldValue === newValue) return;
  if (name === "class") {
     switch(newValue) {
      case "categories":
      case "tags":
      this.list.classList.add("taxonomy-list");
      Util.addVariant(newValue, this.list, "taxonomy-list");
      this.listItem.forEach((c) => {
        c.classList.add("taxonomy-list__item");
        const listDivider = Util.createListDivider();
        c.insertAdjacentElement("afterend", listDivider);
      });
    }
  }

  }
}

 
customElements.define("ycl-list", List);
