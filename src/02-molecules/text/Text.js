import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./text.css?inline";

// The shadow root only handles the wrapper (width, alignment, the emphasized type size, which the
// slotted prose inherits). The prose itself stays in the light DOM and is styled by document rules
// in text.css, because ::slotted() only reaches top-level children and WYSIWYG content nests
// (links in paragraphs, items in lists, code in pre).
const textTemplate = document.createElement("template");
textTemplate.innerHTML = `
	<div class="text-field">
		<div class="text-field__inner">
			<div class="text"><slot></slot></div>
		</div>
	</div>
`;

export class Text extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "text")];
		this.#shadow.appendChild(document.importNode(textTemplate.content, true));
	}
}

if (!customElements.get("ycl-text")) customElements.define("ycl-text", Text);
