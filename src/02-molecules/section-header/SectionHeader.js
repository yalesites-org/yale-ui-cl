import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./section-header.css?inline";
import "../../01-atoms/headings/Heading.js";
import "../../01-atoms/text-link/Link.js";

// Whitespace-only text (template formatting) doesn't count as content.
const hasContent = (slot) => slot.assignedNodes({ flatten: true })
	.some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());

const sectionHeaderTemplate = document.createElement("template");
sectionHeaderTemplate.innerHTML = `
	<div class="section-header">
		<div class="section-header__top">
			<ycl-heading class="section-header__heading" level="2" hidden><slot></slot></ycl-heading>
			<ycl-text-link class="section-header__link" hidden><slot name="link"></slot></ycl-text-link>
		</div>
		<div class="section-header__text" hidden><slot name="text"></slot></div>
	</div>
`;

/**
 * An optional heading, intro text and link that sit above a group of items.
 * Each part is hidden when it has nothing to show. The link needs both link text and an href.
 * @attr {"1"|"2"|"3"|"4"|"5"|"6"} level - Heading level, to fit the page outline. Defaults to 2.
 * @attr {string} link-href - URL of the link, for example a "View all" page.
 * @slot - The heading text.
 * @slot text - Intro text under the heading.
 * @slot link - The link text, for example "View all".
 */
export class SectionHeader extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["level", "link-href"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "section-header")];
		this.#shadow.appendChild(document.importNode(sectionHeaderTemplate.content, true));
		this.top = this.#shadow.querySelector(".section-header__top");
		this.heading = this.#shadow.querySelector(".section-header__heading");
		this.link = this.#shadow.querySelector(".section-header__link");
		this.text = this.#shadow.querySelector(".section-header__text");
		this.slots = {
			heading: this.#shadow.querySelector("slot:not([name])"),
			text: this.#shadow.querySelector('slot[name="text"]'),
			link: this.#shadow.querySelector('slot[name="link"]'),
		};
		for (const slot of Object.values(this.slots)) {
			slot.addEventListener("slotchange", () => this.#render());
		}
		this.#render();
	}

	attributeChangedCallback() {
		this.#render();
	}

	#render() {
		const level = this.getAttribute("level");
		this.heading.setAttribute("level", /^[1-6]$/.test(level) ? level : "2");
		this.heading.hidden = !hasContent(this.slots.heading);
		this.text.hidden = !hasContent(this.slots.text);
		const href = this.getAttribute("link-href");
		if (href) this.link.setAttribute("href", href);
		else this.link.removeAttribute("href");
		this.link.hidden = !href || !hasContent(this.slots.link);
		// An empty row would still add a flex gap above the intro text.
		this.top.hidden = this.heading.hidden && this.link.hidden;
	}

	get level() { return this.getAttribute("level"); }
	set level(value) {
		if (value) this.setAttribute("level", value);
		else this.removeAttribute("level");
	}

	get linkHref() { return this.getAttribute("link-href"); }
	set linkHref(value) {
		if (value) this.setAttribute("link-href", value);
		else this.removeAttribute("link-href");
	}
}

if (!customElements.get("ycl-section-header")) customElements.define("ycl-section-header", SectionHeader);
