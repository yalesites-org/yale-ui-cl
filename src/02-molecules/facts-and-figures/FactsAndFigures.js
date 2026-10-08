import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./facts-and-figures.css?inline";

// Runs onChange(filled) whenever a slot gains or loses content. Whitespace-only text doesn't count.
const watchSlot = (slot, onChange) => {
	const update = () => onChange(slot.assignedNodes({ flatten: true }).some(
		(node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim() !== ""
	));
	slot.addEventListener("slotchange", update);
	update();
};

const factsAndFiguresTemplate = document.createElement("template");
factsAndFiguresTemplate.innerHTML = `
	<div class="facts-and-figures">
		<div class="facts-and-figures__inner">
			<div class="facts-and-figures__icon"><slot name="icon"></slot></div>
			<div class="facts-and-figures__stat"><slot name="stat"></slot></div>
			<div class="facts-and-figures__content"><slot></slot></div>
		</div>
	</div>
`;

export class FactsAndFigures extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "facts-and-figures")];
		this.#shadow.appendChild(document.importNode(factsAndFiguresTemplate.content, true));

		this.#shadow.querySelectorAll("slot").forEach((slot) => {
			watchSlot(slot, (filled) => { slot.parentElement.hidden = !filled; });
		});
	}

	get theme() { return this.getAttribute("theme") ?? "one"; }
	set theme(value) { this.setAttribute("theme", value); }

	get alignment() { return this.getAttribute("alignment") ?? "center"; }
	set alignment(value) { this.setAttribute("alignment", value); }
}

if (!customElements.get("ycl-facts-and-figures")) customElements.define("ycl-facts-and-figures", FactsAndFigures);
