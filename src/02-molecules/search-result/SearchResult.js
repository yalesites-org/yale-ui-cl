import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./search-result.css?inline";
import { iconSvg } from "../../01-atoms/icons/icons.js";

// It's the only cue that a result needs a Yale login, so it
// carries a name rather than being hidden from assistive tech.
const lockIcon = iconSvg("lock-solid", "search-result__icon", "Yale login required");

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
		this.#shadow = this.attachShadow({ mode: "open" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "search-result")];
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

if (!customElements.get("ycl-search-result")) customElements.define("ycl-search-result", SearchResult);
