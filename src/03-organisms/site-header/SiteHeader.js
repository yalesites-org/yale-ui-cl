import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./site-header.css?inline";
import "../../01-atoms/wordmark/Wordmark.js";
import "../../01-atoms/button/Button.js";
import "../../02-molecules/nav-menu/NavMenu.js";

// The one place the wide breakpoint (--break-l) lives: the header sets the slotted menu's layout
// attribute, which CSS can't do, and marks its own wide styles with a class (see site-header.css).
const WIDE = "(min-width: 992px)";

const siteHeaderTemplate = document.createElement("template");
siteHeaderTemplate.innerHTML = `
	<header class="site-header">
		<div class="site-header__bar">
			<div class="site-header__brand">
				<ycl-wordmark class="site-header__wordmark"></ycl-wordmark>
				<a class="site-header__name"></a>
			</div>
			<ycl-button class="site-header__toggle" variant="outline" control-type="dropdown" expanded="false">Menu</ycl-button>
		</div>
		<div class="site-header__nav" tabindex="-1">
			<slot></slot>
		</div>
	</header>
`;

// The toggle has no aria-controls: its <button> lives in ycl-button's shadow root, so an IDREF from
// it can't reach the panel here. aria-expanded carries the state, which is what the disclosure
// pattern needs.
/**
 * Site header with the Yale wordmark, the site name and primary navigation. Put one ycl-nav-menu inside it.
 * @attr {string} site-name - Name of the site, shown next to the wordmark.
 * @attr {string} href - Where the site name links. Defaults to /, also when empty (unlike ycl-wordmark, where empty means no link).
 * @slot - A ycl-nav-menu. The header sets its layout: horizontal on wide screens, vertical in the mobile menu.
 */
export class SiteHeader extends HTMLElement {
	#shadow;
	#media = window.matchMedia(WIDE);
	#open = false;

	static get observedAttributes() {
		return ["site-name", "href"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "site-header")];
		this.#shadow.appendChild(document.importNode(siteHeaderTemplate.content, true));
		this.header = this.#shadow.querySelector(".site-header");
		this.name = this.#shadow.querySelector(".site-header__name");
		this.toggle = this.#shadow.querySelector(".site-header__toggle");
		this.panel = this.#shadow.querySelector(".site-header__nav");
		this.slotEl = this.#shadow.querySelector("slot");

		this.toggle.addEventListener("click", () => this.#setOpen(!this.#open));
		this.slotEl.addEventListener("slotchange", this.#sync);
		this.#renderName();
	}

	connectedCallback() {
		this.#media.addEventListener("change", this.mediaHandler);
		this.#sync();
	}

	disconnectedCallback() {
		this.#media.removeEventListener("change", this.mediaHandler);
		this.#open = false;
		window.removeEventListener("keydown", this.keydownHandler);
	}

	attributeChangedCallback() {
		this.#renderName();
	}

	get siteName() { return this.getAttribute("site-name") ?? ""; }
	set siteName(value) { this.setAttribute("site-name", value); }

	get href() { return this.getAttribute("href") || "/"; }
	set href(value) {
		if (value == null) this.removeAttribute("href");
		else this.setAttribute("href", value);
	}

	// Crossing the breakpoint starts the mobile menu closed again. Narrowing (zooming in, too) hides
	// the menu, so focus inside it moves to the toggle rather than falling to the page. Widening hides
	// the toggle, so focus on it moves to the panel, just ahead of the menu, for the next Tab.
	mediaHandler = () => {
		// The panel holds only the slot, so focus in it is focus on the header's light-DOM children.
		const focused = document.activeElement;
		const menuHadFocus = focused !== this && this.contains(focused);
		const toggleHadFocus = this.#shadow.activeElement === this.toggle;
		this.#setOpen(false);
		if (menuHadFocus && !this.#media.matches) this.toggle.focus();
		if (toggleHadFocus && this.#media.matches) this.panel.focus();
	};

	// Listens on window, not the header: window's bubble listeners run after the document's, so the
	// nav menu (which listens on the document) gets the first say. When it claims an Escape to close
	// one of its dropdowns, the menu panel stays open. Only an Escape from inside the header counts.
	keydownHandler = (event) => {
		if (event.key !== "Escape" || event.defaultPrevented || !event.composedPath().includes(this)) return;
		event.preventDefault();
		this.#setOpen(false);
		this.toggle.focus();
	};

	// No name, no link: an empty link would be a nameless tab stop.
	#renderName() {
		this.name.textContent = this.siteName;
		this.name.setAttribute("href", this.href);
		this.name.hidden = !this.siteName;
	}

	#setOpen(open) {
		this.#open = open;
		this.#sync();
	}

	// The toggle and the collapsible panel only exist on narrow screens. The menu's layout follows
	// the media query only, not whether the mobile menu is open.
	#sync = () => {
		const wide = this.#media.matches;
		const open = !wide && this.#open;
		this.toggle.hidden = wide;
		this.toggle.setAttribute("expanded", String(open));
		this.panel.hidden = !wide && !open;
		window[open ? "addEventListener" : "removeEventListener"]("keydown", this.keydownHandler);
		this.header.classList.toggle("site-header--wide", wide);
		const layout = wide ? "horizontal" : "vertical";
		this.slotEl.assignedElements()
			.filter((el) => el.localName === "ycl-nav-menu" && el.getAttribute("layout") !== layout)
			.forEach((el) => el.setAttribute("layout", layout));
	};
}

if (!customElements.get("ycl-site-header")) customElements.define("ycl-site-header", SiteHeader);
