import baseStyles from '../../styles/base.css?inline';
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);
const dividerTemplate = document.createElement('template');
dividerTemplate.innerHTML = `
        <div class="divider__wrapper"> 	
            <div class="divider__inner">
                <div class="divider divider__width-100"></div>
            </div>
        </div>
`;

export class Divider extends HTMLElement { #shadow;
  static get observedAttributes() {
    
  }

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'closed' });
    this.#shadow.appendChild(document.importNode(dividerTemplate.content, true));
    this.#shadow.adoptedStyleSheets = [baseSheet];
  }
}


 
customElements.define("ycl-divider", Divider);

