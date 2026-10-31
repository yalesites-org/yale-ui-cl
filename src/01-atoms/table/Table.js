import { baseSheet, componentSheet } from '../../styles/shadow.js';
import componentStyles from './table.css?inline';
const tableTemplate = document.createElement('template');
tableTemplate.innerHTML = `
	<div class="table-wrapper">
			<slot></slot>
	</div>
`;

export class Table extends HTMLElement { #shadow;
  #resizeObserver;
  #mutationObserver;

  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'closed' });
	this.#shadow.appendChild(document.importNode(tableTemplate.content, true));
    this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, 'table')];
    this.wrapper = this.#shadow.querySelector('.table-wrapper');
    this.#resizeObserver = new ResizeObserver(this.updateScrollable);
    // A caption edit changes the region's label without resizing anything.
    this.#mutationObserver = new MutationObserver(this.updateScrollable);
    this.#shadow.querySelector('slot').addEventListener('slotchange', this.observeContent);
  }

  connectedCallback() {
    this.observeContent();
    this.#mutationObserver.observe(this, { childList: true, subtree: true, characterData: true });
  }

  disconnectedCallback() {
    this.#resizeObserver.disconnect();
    this.#mutationObserver.disconnect();
  }

  // Watch the wrapper and the slotted table: either one resizing can start or stop the overflow.
  observeContent = () => {
    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(this.wrapper);
    for (const child of this.children) this.#resizeObserver.observe(child);
  };

  // A wide table scrolls inside the wrapper. Only then is the wrapper made a named, focusable region,
  // so keyboard users can scroll it; a table that fits adds no extra tab stop.
  updateScrollable = () => {
    const scrollable = this.wrapper.scrollWidth > this.wrapper.clientWidth;
    if (!scrollable) {
      // Don't pull the tab stop out from under a keyboard user; drop it once focus leaves.
      if (this.#shadow.activeElement === this.wrapper) {
        this.wrapper.addEventListener('focusout', this.updateScrollable, { once: true });
        return;
      }
      this.wrapper.removeAttribute('tabindex');
      this.wrapper.removeAttribute('role');
      this.wrapper.removeAttribute('aria-label');
      return;
    }
    const caption = this.querySelector(':scope > table > caption')?.textContent.trim();
    this.wrapper.setAttribute('tabindex', '0');
    this.wrapper.setAttribute('role', 'region');
    this.wrapper.setAttribute('aria-label', caption || 'Table');
  };
}

if (!customElements.get("ycl-table")) customElements.define("ycl-table", Table);
