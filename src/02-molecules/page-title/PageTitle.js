import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

// A page has exactly one page title, so the h1 lives in the shadow root rather than being slotted:
// the level is never the author's choice here. The heading text comes from the default slot.
const pageTitleTemplate = document.createElement("template");
pageTitleTemplate.innerHTML = `
	<div class="page-title">
		<div class="page-title__inner">
			<div class="page-title__top">
				<div class="page-title__title-wrap">
					<slot name="overline"></slot>
					<h1 class="page-title__heading"><span class="page-title__prefix" hidden></span> <slot></slot></h1>
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
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(pageTitleTemplate.content, true));
		this.prefixEl = this.#shadow.querySelector(".page-title__prefix");

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
			this.prefixEl.textContent = newValue ?? "";
			this.prefixEl.hidden = !newValue;
		}
	}

	get prefix() { return this.getAttribute("prefix"); }
	set prefix(value) {
		if (value) this.setAttribute("prefix", value);
		else this.removeAttribute("prefix");
	}
}

customElements.define("ycl-page-title", PageTitle);
