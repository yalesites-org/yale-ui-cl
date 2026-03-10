const ctaTemplate = document.createElement('template');
ctaTemplate.innerHTML = `
  <link rel="stylesheet" href="src/styles/base.css" />
  <a class="cta" href="#"><slot>Default Link</slot></a>
`;

export class Cta extends HTMLElement {
  #shadow;

  static get observedAttributes() {
    return ["href", "class"];
  }

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'closed' });
  }

  connectedCallback() {
	this.#shadow.appendChild(document.importNode(ctaTemplate.content, true));
	this.#updateHref();
	this.#updateVariant();
  }

  attributeChangedCallback(name, oldValue, newValue) {
	if (oldValue === newValue) return;
	if (name === "href") this.#updateHref();
	if (name === "variant") this.#updateVariant();
  }

  #updateHref() {
    const a = this.#shadow.querySelector("a");
    if (!a) return;
    a.href = this.getAttribute("href") ?? "#";
  }

  #updateVariant() {
    const a = this.#shadow.querySelector("a");
    if (!a) return;
    const variant = this.getAttribute("class");
    if (variant) a.classList.add(`cta--${variant}`);
  }
}
 
customElements.define("cta-link", Cta);
