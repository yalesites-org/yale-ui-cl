import baseStyles from '../../styles/base.css?inline';
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);
const tableTemplate = document.createElement('template');
ctaTemplate.innerHTML = `
	<div class="table-wrapper">
		<table>
			<slot></slot>
		</table>
	</div>
`;

export class Table extends HTMLElement { #shadow;
  static get observedAttributes() {
    
  }

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'closed' });
	this.#shadow.appendChild(document.importNode(ctaTemplate.content, true));
    this.#shadow.adoptedStyleSheets = [baseSheet];
  }
}

 
customElements.define("yc-table", Table);
