import { baseSheet, componentSheet } from '../../styles/shadow.js';
import componentStyles from './table.css?inline';
const tableTemplate = document.createElement('template');
tableTemplate.innerHTML = `
	<div class="table-wrapper">
			<slot></slot>
	</div>
`;

export class Table extends HTMLElement { #shadow;
  static get observedAttributes() {
    
  }

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'closed' });
	this.#shadow.appendChild(document.importNode(tableTemplate.content, true));
    this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, 'table')];
  }
}

 
if (!customElements.get("yc-table")) customElements.define("yc-table", Table);
