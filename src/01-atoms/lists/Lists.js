import { baseSheet, componentSheet } from '../../styles/shadow.js';
import componentStyles from './lists.css?inline';
import * as Util from '../../utility.js';
const listTemplate = document.createElement('template');
listTemplate.innerHTML = `
  <slot></slot>
`;

const taxonomyTypes = ["categories", "tags"];

export class List extends HTMLElement { #shadow;
  static get observedAttributes() {
    return ["class"];
  }

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'closed' });
	  this.#shadow.appendChild(document.importNode(listTemplate.content, true));
    this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, 'lists')];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
	if (oldValue === newValue) return;
    if (name === "class" && this.isConnected) this.render();
  }

  // Look up the slotted list on every render so it works however (and whenever) the children arrive
  render() {
    const list = this.querySelector("ul, ol");
    if (!list) return;

    // Undo any previous render so class changes don't stack dividers or leave stale modifiers
    list.querySelectorAll(":scope > .taxonomy-list__divider").forEach((d) => d.remove());
    list.classList.remove("taxonomy-list");
    Util.addVariant(null, list, "taxonomy-list");
    const items = list.querySelectorAll(":scope > li");
    items.forEach((item) => item.classList.remove("taxonomy-list__item"));

    const types = (this.getAttribute("class") ?? "").split(/\s+/).filter((c) => taxonomyTypes.includes(c));
    if (!types.length) return;

    list.classList.add("taxonomy-list");
    Util.addVariant(types.join(" "), list, "taxonomy-list");
    items.forEach((item) => {
      item.classList.add("taxonomy-list__item");
      item.insertAdjacentElement("afterend", Util.createListDivider());
    });
  }
}


if (!customElements.get("ycl-list")) customElements.define("ycl-list", List);
