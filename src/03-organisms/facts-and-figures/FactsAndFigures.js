import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./facts-and-figures.css?inline";
import "./FactsAndFiguresItem.js";

const named = ["heading", "intro", "link", "image"];

// The image sits behind everything else, under an overlay in the group's theme colour (see the
// CSS) so the heading, intro and stats keep their contrast.
const factsAndFiguresTemplate = document.createElement("template");
factsAndFiguresTemplate.innerHTML = `
	<div class="facts-and-figures">
		<div class="facts-and-figures__image" hidden><slot name="image"></slot></div>
		<div class="facts-and-figures__inner">
			<div class="facts-and-figures__heading" hidden><slot name="heading"></slot></div>
			<div class="facts-and-figures__intro" hidden><slot name="intro"></slot></div>
			<ul class="facts-and-figures__items" role="list"></ul>
			<div class="facts-and-figures__link" hidden><slot name="link"></slot></div>
		</div>
	</div>
`;

// The Facts and Figures organism: a grid list of ycl-facts-and-figures-item stats with an optional
// heading, intro, link and background image. Children with slot="heading", "intro", "link" or
// "image" go there; every other ycl-facts-and-figures-item child is a stat. Slots are assigned by hand so every stat gets its
// own <li> (named slots can only project into a single place); role="list" keeps the semantics in
// Safari, which drops them from lists styled with list-style: none.
// The group's own option is `theme` (its background). Item options (theme, alignment,
// presentation) stay on each item and aren't forwarded; an item with theme="default" has no
// background of its own and takes the group's text colour.
export class FactsAndFigures extends HTMLElement {
	#shadow;
	#observer;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed", slotAssignment: "manual" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "facts-and-figures")];
		this.#shadow.appendChild(document.importNode(factsAndFiguresTemplate.content, true));
		this.#observer = new MutationObserver((records) => {
			// Only direct children and their slot attributes matter; changes inside a stat (e.g. its
			// text) don't need a re-render. subtree is on only to see a child's slot attribute change.
			const relevant = (r) => (r.type === "childList" ? r.target === this : r.target.parentElement === this);
			if (records.some(relevant)) this.#render();
		});
	}

	connectedCallback() {
		this.#observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ["slot"] });
		this.#render();
	}

	disconnectedCallback() {
		this.#observer.disconnect();
	}

	#render() {
		const children = [...this.children];
		named.forEach((name) => {
			const nodes = children.filter((child) => child.slot === name);
			const wrapper = this.#shadow.querySelector(`.facts-and-figures__${name}`);
			wrapper.hidden = nodes.length === 0;
			wrapper.querySelector("slot").assign(...nodes);
			if (name === "image") {
				this.#shadow.querySelector(".facts-and-figures").classList.toggle("facts-and-figures--has-image", nodes.length > 0);
			}
		});

		// Only items become stats, so a stray element (a <template>, a misspelled slot) isn't listed.
		const stats = children.filter((child) => child.localName === "ycl-facts-and-figures-item" && !named.includes(child.slot));
		const list = this.#shadow.querySelector(".facts-and-figures__items");
		list.hidden = stats.length === 0;
		list.replaceChildren(...stats.map((stat) => {
			const item = document.createElement("li");
			item.className = "facts-and-figures__item";
			item.appendChild(document.createElement("slot")).assign(stat);
			return item;
		}));
	}

	get theme() { return this.getAttribute("theme"); }
	set theme(value) {
		if (value) this.setAttribute("theme", value);
		else this.removeAttribute("theme");
	}
}

if (!customElements.get("ycl-facts-and-figures")) customElements.define("ycl-facts-and-figures", FactsAndFigures);
