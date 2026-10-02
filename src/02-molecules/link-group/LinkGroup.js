import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

const linkGroupTemplate = document.createElement("template");
linkGroupTemplate.innerHTML = `
	<div class="link-group">
		<div class="link-group__inner">
			<div class="link-group__heading link-group__heading--one" hidden><slot></slot></div>
			<div class="link-group__heading link-group__heading--two" hidden><slot></slot></div>
			<ul class="link-group__links-column link-group__links-column--one" hidden></ul>
			<ul class="link-group__links-column link-group__links-column--two" hidden></ul>
		</div>
	</div>
`;

// Slots are assigned by hand so every slotted link can get its own <li>: named slots can only
// project into a single place, which would leave the links without real list markup.
export class LinkGroup extends HTMLElement {
	#shadow;
	#observer;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed", slotAssignment: "manual" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(linkGroupTemplate.content, true));
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
		const headingOne = bySlot("heading-one");
		const headingTwo = bySlot("heading-two");
		const twoHeadings = headingOne.length > 0 && headingTwo.length > 0;

		[["one", headingOne], ["two", headingTwo]].forEach(([column, nodes]) => {
			const heading = this.#shadow.querySelector(`.link-group__heading--${column}`);
			heading.hidden = nodes.length === 0;
			heading.classList.toggle("link-group__heading--two-headings", twoHeadings);
			heading.querySelector("slot").assign(...nodes);

			const list = this.#shadow.querySelector(`.link-group__links-column--${column}`);
			const links = bySlot(`links-${column}`);
			list.hidden = links.length === 0;
			list.replaceChildren(...links.map(() => {
				const item = document.createElement("li");
				item.className = "link-group__list-item";
				item.appendChild(document.createElement("slot"));
				return item;
			}));
			list.querySelectorAll("slot").forEach((slot, i) => slot.assign(links[i]));
		});
	}
}

customElements.define("ycl-link-group", LinkGroup);
