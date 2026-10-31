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
  }

  disconnectedCallback() {
    this.#resizeObserver.disconnect();
    this.#mutationObserver.disconnect();
  }

  // The slotted table, either a direct child or passed through a slot, as ycl-data-table does.
  // A nested slot's slotchange bubbles to this shadow root's slot, so it re-resolves too.
  get #table() {
    for (const child of this.children) {
      const elements = child instanceof HTMLSlotElement ? child.assignedElements({ flatten: true }) : [child];
      const table = elements.find((element) => element instanceof HTMLTableElement);
      if (table) return table;
    }
    return null;
  }

  // Watch the wrapper and the slotted table: either one resizing can start or stop the overflow.
  // A table passed through a slot lives in another tree, so its caption edits are watched on it directly.
  observeContent = () => {
    const table = this.#table;
    const options = { childList: true, subtree: true, characterData: true };
    this.#resizeObserver.disconnect();
    this.#resizeObserver.observe(this.wrapper);
    for (const child of this.children) this.#resizeObserver.observe(child);
    if (table) this.#resizeObserver.observe(table);
    this.#mutationObserver.disconnect();
    this.#mutationObserver.observe(this, options);
    if (table && !this.contains(table)) this.#mutationObserver.observe(table, options);
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
    const caption = this.#table?.caption?.textContent.trim();
    this.wrapper.setAttribute('tabindex', '0');
    this.wrapper.setAttribute('role', 'region');
    this.wrapper.setAttribute('aria-label', caption || 'Table');
  };
}

if (!customElements.get("ycl-table")) customElements.define("ycl-table", Table);
