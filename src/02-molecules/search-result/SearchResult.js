import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

// Font Awesome Free "lock" (CC BY 4.0). It's the only cue that a result needs a Yale login, so it
// carries a name rather than being hidden from assistive tech.
const lockIcon = `<svg class="search-result__icon" viewBox="0 0 448 512" role="img" aria-label="Yale login required" focusable="false"><path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>`;

// The author's heading (h2, h3...) is slotted inside the link so it keeps its semantics while the
// whole title stays one link target, as in the Twig heading-with-url.
const searchResultTemplate = document.createElement("template");
searchResultTemplate.innerHTML = `
	<div class="search-result">
		<div class="search-result__content">
			<div class="search-result__content-type" hidden></div>
			<div class="search-result__heading">
				<span class="search-result__prefix-icon">${lockIcon}</span>
				<a class="search-result__heading-link"><slot name="heading"></slot></a>
			</div>
			<div class="search-result__details">
				<div class="search-result__breadcrumbs" hidden><slot name="breadcrumbs"></slot></div>
				<div class="search-result__highlighted" hidden><slot name="highlighted"></slot></div>
				<div class="search-result__teaser" hidden><slot name="teaser"></slot></div>
			</div>
		</div>
	</div>
`;

export class SearchResult extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["href", "content-type"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(searchResultTemplate.content, true));
		this.link = this.#shadow.querySelector(".search-result__heading-link");
		this.contentTypeEl = this.#shadow.querySelector(".search-result__content-type");

		// Wrappers start hidden and only show once something is slotted, so empty ones don't leave
		// margins behind. slotchange never fires for a slot that stays empty.
		for (const name of ["breadcrumbs", "highlighted", "teaser"]) {
			const slot = this.#shadow.querySelector(`slot[name="${name}"]`);
			const wrapper = this.#shadow.querySelector(`.search-result__${name}`);
			slot.addEventListener("slotchange", () => {
				wrapper.hidden = slot.assignedElements().length === 0;
			});
		}
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "href") {
			if (newValue === null) this.link.removeAttribute("href");
			else this.link.href = newValue;
		}
		if (name === "content-type") {
			this.contentTypeEl.textContent = newValue ?? "";
			this.contentTypeEl.hidden = !newValue;
		}
	}

	get href() { return this.getAttribute("href"); }
	set href(value) { this.setAttribute("href", value); }

	// CAS (Yale login) results show a lock and hide everything but the title.
	get cas() { return this.hasAttribute("cas"); }
	set cas(value) {
		if (value) this.setAttribute("cas", "");
		else this.removeAttribute("cas");
	}
}

customElements.define("ycl-search-result", SearchResult);
