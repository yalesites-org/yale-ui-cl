import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./facts-and-figures.css?inline";
import "./FactsAndFiguresItem.js";

const named = ["heading", "intro", "link", "image"];
const forwarded = ["alignment", "presentation", "padded"];

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
// The group's one theme option is `theme`, one to six (default one), as in YaleSites. Stats inside
// the group have no background of their own and take the group's colours, whatever their own
// theme (see the CSS). alignment, presentation and padded set on the group are copied onto every
// stat, over the stat's own.
export class FactsAndFigures extends HTMLElement {
	#shadow;
	#observer;

	static get observedAttributes() {
		return forwarded;
	}

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

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		// A group option that's removed is removed from the stats too; one never set leaves theirs alone.
		// The observer only watches slot attributes, so this doesn't re-render.
		this.#stats().forEach((stat) => {
			if (newValue === null) stat.removeAttribute(name);
			else stat.setAttribute(name, newValue);
		});
	}

	#stats() {
		// Only items become stats, so a stray element (a <template>, a misspelled slot) isn't listed.
		return [...this.children].filter((child) => child.localName === "ycl-facts-and-figures-item" && !named.includes(child.slot));
	}

	#render() {
		const children = [...this.children];
		named.forEach((name) => {
			const nodes = children.filter((child) => child.slot === name);
			const wrapper = this.#shadow.querySelector(`.facts-and-figures__${name}`);
			wrapper.hidden = nodes.length === 0;
			wrapper.querySelector("slot").assign(...nodes);
		});

		const stats = this.#stats();
		forwarded.forEach((name) => {
			if (this.hasAttribute(name)) stats.forEach((stat) => stat.setAttribute(name, this.getAttribute(name)));
		});
		const list = this.#shadow.querySelector(".facts-and-figures__items");
		list.hidden = stats.length === 0;
		const slots = stats.map(() => document.createElement("slot"));
		list.replaceChildren(...slots.map((slot) => {
			const item = document.createElement("li");
			item.className = "facts-and-figures__item";
			item.appendChild(slot);
			return item;
		}));
		// Assign once the slots are in the shadow root, rather than relying on assignment surviving insertion.
		slots.forEach((slot, i) => slot.assign(stats[i]));
	}

	get theme() { return this.getAttribute("theme") ?? "one"; }
	set theme(value) {
		if (value) this.setAttribute("theme", value);
		else this.removeAttribute("theme");
	}

	get alignment() { return this.getAttribute("alignment"); }
	set alignment(value) { this.setAttribute("alignment", value); }

	get presentation() { return this.getAttribute("presentation"); }
	set presentation(value) { this.setAttribute("presentation", value); }

	get padded() { return this.hasAttribute("padded"); }
	set padded(value) {
		if (value) this.setAttribute("padded", "");
		else this.removeAttribute("padded");
	}
}

if (!customElements.get("ycl-facts-and-figures")) customElements.define("ycl-facts-and-figures", FactsAndFigures);
