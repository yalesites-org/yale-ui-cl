import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

let headingCount = 0;

const relatedContentTemplate = document.createElement("template");
relatedContentTemplate.innerHTML = `
	<div class="related-content">
		<div class="related-content__inner">
			<div class="related-content__heading"><slot name="heading"></slot></div>
			<div class="related-content__list"><slot></slot></div>
		</div>
	</div>
`;

// The author's heading is slotted inside the link so it keeps its semantics (h3 under the
// section's h2) while the whole title is one link target.
const relatedContentItemTemplate = document.createElement("template");
relatedContentItemTemplate.innerHTML = `
	<div class="related-card">
		<p class="related-card__eyebrow"><span class="related-card__type"></span><span class="related-card__eyebrow-separator" aria-hidden="true" hidden> | </span><span class="related-card__category"></span></p>
		<div class="related-card__title"><a class="related-card__link"><slot name="heading"></slot></a></div>
	</div>
`;

export class RelatedContentItem extends HTMLElement {
	#shadow;
	#internals;
	static get observedAttributes() {
		return ["href", "type", "category"];
	}

	constructor() {
		super();
		this.#internals = this.attachInternals();
		this.#internals.role = "article";
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(relatedContentItemTemplate.content, true));
		this.link = this.#shadow.querySelector(".related-card__link");
		this.typeEl = this.#shadow.querySelector(".related-card__type");
		this.categoryEl = this.#shadow.querySelector(".related-card__category");
		this.separatorEl = this.#shadow.querySelector(".related-card__eyebrow-separator");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "href") {
			if (newValue === null) this.link.removeAttribute("href");
			else this.link.href = newValue;
		}
		if (name === "type") this.typeEl.textContent = newValue ?? "";
		if (name === "category") this.categoryEl.textContent = newValue ?? "";
		// The separator only makes sense between a type and a category (profiles have no category).
		this.separatorEl.hidden = !(this.getAttribute("type") && this.getAttribute("category"));
	}

	get href() { return this.getAttribute("href"); }
	set href(value) { this.setAttribute("href", value); }
}

export class RelatedContent extends HTMLElement {
	#shadow;
	#internals;

	constructor() {
		super();
		this.#internals = this.attachInternals();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(relatedContentTemplate.content, true));
		this.headingWrapper = this.#shadow.querySelector(".related-content__heading");
		const slot = this.#shadow.querySelector('slot[name="heading"]');
		slot.addEventListener("slotchange", () => this.#labelRegion(slot.assignedElements()[0]));
		this.headingWrapper.hidden = true;
	}

	// The heading names the region landmark, as the Twig section's aria-labelledby does. The host
	// and the slotted heading share the light DOM, so the id reference works across the shadow
	// boundary. Without a heading the element isn't a landmark, since a region needs a name.
	#labelRegion(heading) {
		this.headingWrapper.hidden = !heading;
		if (!heading) {
			this.#internals.role = null;
			this.removeAttribute("aria-labelledby");
			return;
		}
		if (!heading.id) heading.id = `ycl-related-content-heading-${++headingCount}`;
		this.#internals.role = "region";
		this.setAttribute("aria-labelledby", heading.id);
	}
}

customElements.define("ycl-related-content", RelatedContent);
customElements.define("ycl-related-content-item", RelatedContentItem);
