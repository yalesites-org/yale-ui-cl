import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./quick-links.css?inline";

const quickLinksTemplate = document.createElement("template");
quickLinksTemplate.innerHTML = `
	<div class="quick-links" data-quick-links-layout="stacked">
		<div class="quick-links__inner">
			<div class="quick-links__text">
				<div class="quick-links__heading" hidden><slot></slot></div>
				<div class="quick-links__description" hidden><slot></slot></div>
			</div>
			<div class="quick-links__image" hidden><slot></slot></div>
			<ul class="quick-links__links"></ul>
		</div>
	</div>
`;

// Slots are assigned by hand so every slotted link can get its own <li>: named slots can only
// project into a single place, which would leave the links without real list markup.
// Children with slot="heading", "description" or "image" go there; every other child is a link.
export class QuickLinks extends HTMLElement {
	#shadow;
	#observer;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed", slotAssignment: "manual" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "quick-links")];
		this.#shadow.appendChild(document.importNode(quickLinksTemplate.content, true));
		this.#observer = new MutationObserver((records) => {
			// Only direct children matter; changes inside a link (e.g. its text) don't need a re-render.
			if (records.some((r) => r.target === this || r.target.parentElement === this)) this.#render();
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
		const named = ["heading", "description", "image"];
		named.forEach((name) => {
			const nodes = children.filter((child) => child.slot === name);
			const wrapper = this.#shadow.querySelector(`.quick-links__${name}`);
			wrapper.hidden = nodes.length === 0;
			wrapper.querySelector("slot").assign(...nodes);
		});

		// As in the Twig, a description switches the layout from stacked to side-by-side.
		const hasDescription = children.some((child) => child.slot === "description");
		this.#shadow.querySelector(".quick-links").dataset.quickLinksLayout = hasDescription ? "fluid" : "stacked";

		const links = children.filter((child) => !named.includes(child.slot));
		const list = this.#shadow.querySelector(".quick-links__links");
		list.replaceChildren(...links.map(() => {
			const item = document.createElement("li");
			item.className = "quick-links__list-item";
			item.appendChild(document.createElement("slot"));
			return item;
		}));
		list.querySelectorAll("slot").forEach((slot, i) => slot.assign(links[i]));
	}
}

if (!customElements.get("ycl-quick-links")) customElements.define("ycl-quick-links", QuickLinks);
