import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const columns = ["one", "two", "three", "four"];

// Columns are built in #render(), straight after the heading, so only columns with links exist.
const linkGridTemplate = document.createElement("template");
linkGridTemplate.innerHTML = `
	<div class="link-grid">
		<div class="link-grid__inner">
			<div class="link-grid__heading" hidden><slot></slot></div>
		</div>
	</div>
`;

// Slots are assigned by hand so every slotted link can get its own <li>: named slots can only
// project into a single place, which would leave the links without real list markup.
export class LinkGrid extends HTMLElement {
	#shadow;
	#observer;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed", slotAssignment: "manual" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(linkGridTemplate.content, true));
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
		const bySlot = (name) => children.filter((child) => child.slot === name);
		const inner = this.#shadow.querySelector(".link-grid__inner");

		const heading = inner.querySelector(".link-grid__heading");
		const headingNodes = bySlot("heading");
		heading.hidden = headingNodes.length === 0;
		heading.querySelector("slot").assign(...headingNodes);

		inner.querySelectorAll(".link-grid__column-wrapper").forEach((column) => column.remove());
		columns.forEach((column) => {
			const links = bySlot(`links-${column}`);
			if (!links.length) return;
			const columnHeading = bySlot(`heading-${column}`);

			const wrapper = document.createElement("div");
			wrapper.className = `link-grid__column-wrapper link-grid__column-wrapper--${column}`;
			wrapper.innerHTML = `
				${columnHeading.length ? `<div class="link-grid__column-heading"><slot></slot></div>` : ""}
				<ul class="link-grid__links-column link-grid__links-column--${column}">
					${links.map(() => `<li class="link-grid__list-item"><slot></slot></li>`).join("")}
				</ul>
			`;
			wrapper.classList.toggle("link-grid__column-wrapper--has-heading", columnHeading.length > 0);
			inner.appendChild(wrapper);

			const headingSlot = wrapper.querySelector(".link-grid__column-heading slot");
			if (headingSlot) headingSlot.assign(...columnHeading);
			wrapper.querySelectorAll(".link-grid__list-item slot").forEach((slot, i) => slot.assign(links[i]));
		});
	}
}

customElements.define("ycl-link-grid", LinkGrid);
