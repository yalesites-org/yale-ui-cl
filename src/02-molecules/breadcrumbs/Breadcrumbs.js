import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./breadcrumbs.css?inline";
import { iconSvg } from "../../01-atoms/icons/icons.js";

// Rotated in CSS: down for the toggle, sideways for the scroll arrows.
const angleDownIcon = (className) => iconSvg("angle-down", className);

// The scroll arrows are mouse-only, as in the Twig: keyboard users reach every link with Tab, and
// a focused link is scrolled into view, so the arrows are hidden from assistive tech and focus.
const breadcrumbsTemplate = document.createElement("template");
breadcrumbsTemplate.innerHTML = `
	<nav class="breadcrumbs__wrapper" aria-label="Breadcrumb" data-breadcrumbs-overflow="hidden" hidden>
		<button class="breadcrumbs__button" type="button" aria-expanded="false" aria-controls="breadcrumbs-inner">
			${angleDownIcon("breadcrumbs__icon")}
			<span class="breadcrumbs__parent"></span><span class="visually-hidden">, show all breadcrumbs</span>
		</button>
		<div class="breadcrumbs__inner" id="breadcrumbs-inner" data-scroll-indicator="none">
			<ol class="breadcrumbs__menu"></ol>
			<button class="breadcrumbs__control breadcrumbs__control--left" type="button" aria-hidden="true" tabindex="-1">${angleDownIcon("breadcrumbs__control-icon")}</button>
			<button class="breadcrumbs__control breadcrumbs__control--right" type="button" aria-hidden="true" tabindex="-1">${angleDownIcon("breadcrumbs__control-icon")}</button>
		</div>
	</nav>
`;

// Slots are assigned by hand so every slotted item gets its own <li>, as in ycl-link-group.
export class Breadcrumbs extends HTMLElement {
	#shadow;
	#observer;
	#resizeObserver;
	// The item this component marked as the current page, so the mark can move when items change
	// without touching one the author set.
	#marked = null;
	// Attributes set in markup arrive before connectedCallback; one render there covers them all.
	#connected = false;

	static get observedAttributes() {
		return ["label", "no-current", "wrap"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed", slotAssignment: "manual" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "breadcrumbs")];
		this.#shadow.appendChild(document.importNode(breadcrumbsTemplate.content, true));
		this.nav = this.#shadow.querySelector(".breadcrumbs__wrapper");
		this.button = this.#shadow.querySelector(".breadcrumbs__button");
		this.inner = this.#shadow.querySelector(".breadcrumbs__inner");
		this.list = this.#shadow.querySelector(".breadcrumbs__menu");
		this.parentLabel = this.#shadow.querySelector(".breadcrumbs__parent");
		this.leftControl = this.#shadow.querySelector(".breadcrumbs__control--left");

		this.#observer = new MutationObserver((records) => {
			// Only direct children matter; changes inside a link (e.g. its text) don't need a re-render.
			if (records.some((r) => r.target === this || r.target.parentElement === this)) this.#render();
		});
		this.#resizeObserver = new ResizeObserver(() => this.#setOverflow());

		// Expanding is one-way: once the whole trail is showing there's nothing to collapse back to.
		this.button.addEventListener("click", () => {
			this.nav.dataset.breadcrumbsOverflow = "expanded";
			this.button.setAttribute("aria-expanded", "true");
			this.#setOverflow();
			// The button hides itself, so focus moves to the parent crumb it was naming rather than
			// dropping to the document.
			const parent = [...this.children].at(-2);
			(parent?.link ?? parent)?.focus();
		});
		this.list.addEventListener("scroll", () => this.#setOverflow(), { passive: true });
		this.leftControl.addEventListener("click", () => this.#scrollBy("left"));
		this.#shadow.querySelector(".breadcrumbs__control--right").addEventListener("click", () => this.#scrollBy("right"));
		// Slotted items sit in the light DOM, so focus is caught on the host. scroll-padding on the
		// list keeps the focused crumb clear of the arrows, as in ycl-tabs.
		this.addEventListener("focusin", (event) => event.target.scrollIntoView({ block: "nearest", inline: "nearest" }));
	}

	connectedCallback() {
		this.#observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ["slot", "aria-current"] });
		this.#resizeObserver.observe(this.list);
		this.#connected = true;
		this.#render();
	}

	disconnectedCallback() {
		this.#connected = false;
		this.#observer.disconnect();
		this.#resizeObserver.disconnect();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "label") this.nav.setAttribute("aria-label", newValue || "Breadcrumb");
		else if (this.#connected) this.#render();
	}

	get label() { return this.getAttribute("label"); }
	set label(value) { this.setAttribute("label", value); }

	get wrap() { return this.hasAttribute("wrap"); }
	set wrap(value) { this.toggleAttribute("wrap", Boolean(value)); }

	get noCurrent() { return this.hasAttribute("no-current"); }
	set noCurrent(value) { this.toggleAttribute("no-current", Boolean(value)); }

	#render() {
		const children = [...this.children];

		// The last item is the current page unless the author marked one or opted out. Only touch the
		// attribute when the mark actually moves: a text-link forwards it to its inner link, where
		// focus lands, and rebuilds its link icon on every change.
		const authorMarked = children.some((child) => child !== this.#marked && (child.getAttribute("aria-current") ?? "false") !== "false");
		const target = this.noCurrent || authorMarked ? null : (children.at(-1) ?? null);
		if (this.#marked && this.#marked !== target) this.#marked.removeAttribute("aria-current");
		if (target && target.getAttribute("aria-current") !== "page") target.setAttribute("aria-current", "page");
		this.#marked = target;

		// A single crumb is just the current page, which tells nobody anything.
		this.nav.hidden = children.length < 2;
		// Collapsing needs a parent page to name on the toggle and something left to hide.
		this.nav.classList.toggle("breadcrumbs__wrapper--collapsible", children.length >= 3 && !this.wrap);
		this.parentLabel.textContent = children.at(-2)?.textContent.trim() ?? "";

		this.list.replaceChildren(...children.map((child) => {
			const item = document.createElement("li");
			item.className = "breadcrumbs__item";
			const slot = item.appendChild(document.createElement("slot"));
			slot.assign(child);
			return item;
		}));
		// Drop the records of this render's own aria-current writes so they don't trigger another.
		this.#observer.takeRecords();
		this.#setOverflow();
	}

	// Each item's left and right edges within the scrolling list, independent of the scroll position.
	#itemBounds() {
		return [...this.list.children].map((item) => {
			const left = item.offsetLeft - this.list.offsetLeft;
			return { left, right: left + item.offsetWidth };
		});
	}

	// Shows an arrow on each side that has items scrolled out of view.
	#setOverflow() {
		const { scrollLeft, scrollWidth, clientWidth } = this.list;
		const left = scrollLeft > 0;
		const right = Math.ceil(scrollLeft + clientWidth) < scrollWidth;
		const direction = left && right ? "both" : left ? "left" : right ? "right" : "none";
		// Scroll fires every frame while smooth-scrolling; only restyle when the arrows change.
		if (this.inner.dataset.scrollIndicator !== direction) this.inner.dataset.scrollIndicator = direction;
	}

	// Steps one item at a time, leaving room for the arrow that sits over the list's edge.
	#scrollBy(direction) {
		const controls = this.leftControl.offsetWidth;
		const { scrollLeft } = this.list;
		const bounds = this.#itemBounds();
		const target = direction === "right"
			? bounds.filter((b) => b.right > scrollLeft + controls)[1]
			: bounds.filter((b) => b.left < scrollLeft).at(-1);
		// Clicking faster than the arrows update can leave nothing further to scroll to.
		if (!target) return;
		this.list.scrollLeft = Math.max(0, target.left - controls);
	}
}

if (!customElements.get("ycl-breadcrumbs")) customElements.define("ycl-breadcrumbs", Breadcrumbs);
