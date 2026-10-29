import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./page-title.css?inline";
import "../../01-atoms/headings/Heading.js";

// A page has exactly one page title, so the heading lives in the shadow root rather than being
// slotted: it's always level 1, never the author's choice. The heading text comes from the
// default slot.
const pageTitleTemplate = document.createElement("template");
pageTitleTemplate.innerHTML = `
	<div class="page-title">
		<div class="page-title__inner">
			<div class="page-title__top">
				<div class="page-title__title-wrap">
					<slot name="overline"></slot>
					<ycl-heading class="page-title__heading" level="1"><slot></slot></ycl-heading>
					<slot name="extra"></slot>
				</div>
				<slot name="image"></slot>
			</div>
			<div class="basic-meta" hidden><slot name="meta"></slot></div>
			<slot name="meta-extra"></slot>
			<div class="page-title__social-links" hidden><slot name="social-links"></slot></div>
		</div>
	</div>
`;

export class PageTitle extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["prefix"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "open" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "page-title")];
		this.#shadow.appendChild(document.importNode(pageTitleTemplate.content, true));
		this.heading = this.#shadow.querySelector(".page-title__heading");

		// Wrappers start hidden and only show once something is slotted, so empty ones don't leave
		// margins behind. slotchange never fires for a slot that stays empty.
		for (const [slotName, wrapper] of [["meta", ".basic-meta"], ["social-links", ".page-title__social-links"]]) {
			const slot = this.#shadow.querySelector(`slot[name="${slotName}"]`);
			const wrapperEl = this.#shadow.querySelector(wrapper);
			slot.addEventListener("slotchange", () => {
				wrapperEl.hidden = slot.assignedElements().length === 0;
			});
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "prefix") {
			if (newValue) this.heading.setAttribute("prefix", newValue);
			else this.heading.removeAttribute("prefix");
		}
	}

	get prefix() { return this.getAttribute("prefix"); }
	set prefix(value) {
		if (value) this.setAttribute("prefix", value);
		else this.removeAttribute("prefix");
	}
}

if (!customElements.get("ycl-page-title")) customElements.define("ycl-page-title", PageTitle);
