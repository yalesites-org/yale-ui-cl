import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./nav-menu.css?inline";
import linkStyles from "../../01-atoms/text-link/link.css?inline";
import { iconSvg } from "../../01-atoms/icons/icons.js";

const angleDownIcon = iconSvg("angle-down", "nav-menu__icon");

const navMenuTemplate = document.createElement("template");
navMenuTemplate.innerHTML = `
	<nav class="nav-menu" aria-label="Main" data-layout="horizontal">
		<ul class="nav-menu__list"></ul>
	</nav>
`;

// One menu entry: a link (label + href), or, when it has ycl-nav-menu-item children, a dropdown
// toggle (label) for those child links. It renders nothing itself: ycl-nav-menu reads these as data
// and builds the whole menu in its own shadow root. The empty shadow root keeps an item from ever
// rendering on its own.
export class NavMenuItem extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "closed" });
	}

	get label() { return this.getAttribute("label") ?? ""; }
	set label(value) { this.setAttribute("label", value); }

	get href() { return this.getAttribute("href"); }
	set href(value) {
		if (value == null) this.removeAttribute("href");
		else this.setAttribute("href", value);
	}

	get current() { return this.hasAttribute("current"); }
	set current(value) { this.toggleAttribute("current", Boolean(value)); }
}

const childItems = (element) => [...element.children].filter((child) => child.localName === "ycl-nav-menu-item");

// A disclosure navigation menu (WAI-ARIA APG pattern). The links, toggles and dropdown lists are
// all built here, in one shadow root, rather than from the text-link and ycl-button atoms:
// - Text Link keeps its <a> in its own closed shadow root and only forwards href, class and
//   target, so aria-current couldn't reach the element that takes focus.
// - ycl-button does forward aria-expanded to its inner <button> (and delegates focus), but
//   aria-controls is an IDREF, which can't point from inside the atom's shadow root to a
//   dropdown list in this one; and its CTA styling would all need overriding for a menu toggle.
// - With every <ul>, <li>, <a> and <button> in one shadow root the lists are real lists (<li>s in
//   separate shadow roots aren't list children, see Accordion.js) and one set of handlers sees them all.
// Instead the links adopt the Text Link atom's stylesheet (class "link") and the toggles reuse the
// Button atom's dropdown icon.
export class NavMenu extends HTMLElement {
	#shadow;
	#observer;
	// The open dropdown's toggle, and the ycl-nav-menu-item it was built from: a rebuild reopens the
	// dropdown for the same item, wherever it has moved to.
	#open = null;
	#openItem = null;
	// Each rendered link and toggle, mapped to the ycl-nav-menu-item it was built from and which kind
	// of element it is ("link" or "toggle"): a rebuild finds the new element for the same item.
	#sources = new WeakMap();

	static get observedAttributes() {
		return ["label", "layout"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(linkStyles, "text-link"), componentSheet(componentStyles, "nav-menu")];
		this.#shadow.appendChild(document.importNode(navMenuTemplate.content, true));
		this.nav = this.#shadow.querySelector(".nav-menu");
		this.list = this.#shadow.querySelector(".nav-menu__list");

		this.nav.addEventListener("click", this.clickHandler);
		this.nav.addEventListener("focusout", this.focusoutHandler);
		this.#observer = new MutationObserver(this.#build);
	}

	connectedCallback() {
		this.#observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ["label", "href", "current"] });
		this.#build();
	}

	disconnectedCallback() {
		this.#observer.disconnect();
		this.#listen(false);
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "label") this.nav.setAttribute("aria-label", newValue || "Main");
		if (name === "layout") this.nav.dataset.layout = this.layout;
	}

	get label() { return this.getAttribute("label") ?? "Main"; }
	set label(value) { this.setAttribute("label", value); }

	// "horizontal" (primary navigation, floating dropdowns) or "vertical" (secondary/mobile
	// navigation, dropdowns expand inline). Anything else falls back to horizontal.
	get layout() { return this.getAttribute("layout") === "vertical" ? "vertical" : "horizontal"; }
	set layout(value) { this.setAttribute("layout", value); }

	clickHandler = (event) => {
		const toggle = event.target.closest(".nav-menu__toggle");
		if (!toggle) return;
		this.#setOpen(toggle.getAttribute("aria-expanded") === "true" ? null : toggle);
	};

	// Listens on the document (while a dropdown is open) rather than the nav: a dropdown opened by
	// pointer may leave focus on the body (macOS Safari doesn't focus buttons on click). Focus goes
	// back to the toggle only if it was on the toggle or in its dropdown, not elsewhere in the menu.
	// Escape is only claimed (preventDefault) in that case too. When focus is on something else
	// outside the menu (a dialog, another widget), the Escape belongs to it, so the menu ignores it;
	// it also ignores an Escape another handler has already dealt with.
	keydownHandler = (event) => {
		if (event.key !== "Escape" || !this.#open || event.defaultPrevented) return;
		const inMenu = event.composedPath().includes(this);
		const pageFocused = (document.activeElement ?? document.body) === document.body;
		if (!inMenu && !pageFocused) return;
		const toggle = this.#open;
		const focused = this.#shadow.activeElement;
		const claim = inMenu && focused && toggle.parentElement.contains(focused);
		this.#setOpen(null);
		if (!claim) return;
		event.preventDefault();
		toggle.focus();
	};

	// A floating dropdown shouldn't linger over the page once the user has moved on. Inline
	// (vertical) dropdowns are part of the page flow, so they stay open.
	focusoutHandler = (event) => {
		if (this.layout !== "horizontal" || !event.relatedTarget) return;
		if (!this.#shadow.contains(event.relatedTarget)) this.#setOpen(null);
	};

	// pointerdown rather than click: iOS Safari doesn't send click to the document for taps on
	// non-interactive content.
	documentPointerHandler = (event) => {
		if (this.layout !== "horizontal" || event.composedPath().includes(this)) return;
		this.#setOpen(null);
	};

	// Opens the given toggle's dropdown (or none), closing any other: only one is open at a time.
	#setOpen(toggle) {
		this.#open = toggle;
		this.#openItem = toggle ? this.#sources.get(toggle).item : null;
		this.#listen(Boolean(toggle));
		this.list.querySelectorAll(".nav-menu__toggle").forEach((button) => {
			const isOpen = button === toggle;
			button.setAttribute("aria-expanded", String(isOpen));
			this.#shadow.getElementById(button.getAttribute("aria-controls")).hidden = !isOpen;
		});
	}

	#listen(on) {
		const method = on ? "addEventListener" : "removeEventListener";
		document[method]("keydown", this.keydownHandler);
		document[method]("pointerdown", this.documentPointerHandler);
	}

	// Reads attributes rather than the item's accessors: items may not be upgraded yet when the
	// menu first builds.
	#link(item, className) {
		const link = document.createElement("a");
		link.className = `link ${className}`;
		// No href, no link: an <a> without one isn't focusable or announced as a link.
		if (item.hasAttribute("href")) link.href = item.getAttribute("href");
		link.textContent = item.getAttribute("label") ?? "";
		if (item.hasAttribute("current")) link.setAttribute("aria-current", "page");
		return link;
	}

	// The rebuilt link or toggle for the given item, if there still is one.
	#rendered(item, kind) {
		return [...this.list.querySelectorAll("a, button")].find((element) => {
			const source = this.#sources.get(element);
			return source?.item === item && source.kind === kind;
		}) ?? null;
	}

	// Rebuilds the whole list. The open dropdown and the focused link or toggle are tracked by the
	// item they were built from, not their position, so they follow it when items are added, removed
	// or moved. If the focused item is gone, focus isn't moved to some other item.
	#build = () => {
		const focused = this.#sources.get(this.#shadow.activeElement);
		this.#sources = new WeakMap();
		const items = childItems(this).map((item, index) => {
			const li = document.createElement("li");
			li.className = "nav-menu__item";
			const children = childItems(item);
			if (!children.length) {
				const link = this.#link(item, "nav-menu__link");
				this.#sources.set(link, { item, kind: "link" });
				li.append(link);
				return li;
			}

			const id = `nav-menu-submenu-${index}`;
			const toggle = document.createElement("button");
			toggle.type = "button";
			toggle.className = "nav-menu__toggle";
			this.#sources.set(toggle, { item, kind: "toggle" });
			toggle.setAttribute("aria-expanded", "false");
			toggle.setAttribute("aria-controls", id);
			// A current page inside the dropdown also marks its toggle, visually only: aria-current
			// belongs on the link itself.
			toggle.classList.toggle("is-current", children.some((child) => child.hasAttribute("current")));
			const label = document.createElement("span");
			label.textContent = item.getAttribute("label") ?? "";
			toggle.append(label);
			toggle.insertAdjacentHTML("beforeend", angleDownIcon);

			const submenu = document.createElement("ul");
			submenu.className = "nav-menu__submenu";
			submenu.id = id;
			submenu.hidden = true;
			submenu.append(...children.map((child) => {
				const childLi = document.createElement("li");
				childLi.className = "nav-menu__subitem";
				const link = this.#link(child, "nav-menu__sublink");
				this.#sources.set(link, { item: child, kind: "link" });
				childLi.append(link);
				return childLi;
			}));

			li.append(toggle, submenu);
			return li;
		});
		const openItem = this.#openItem;
		this.list.replaceChildren(...items);
		this.#setOpen(openItem ? this.#rendered(openItem, "toggle") : null);
		if (focused) this.#rendered(focused.item, focused.kind)?.focus();
	};
}

// ycl-nav-menu-item first, so its accessors exist by the time ycl-nav-menu upgrades and reads its children.
if (!customElements.get("ycl-nav-menu-item")) customElements.define("ycl-nav-menu-item", NavMenuItem);
if (!customElements.get("ycl-nav-menu")) customElements.define("ycl-nav-menu", NavMenu);
