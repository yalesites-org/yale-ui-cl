import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./tabs.css?inline";

// Font Awesome Free "angle-down" (CC BY 4.0), decorative only; rotated in CSS to point sideways.
const angleDownIcon = `<svg viewBox="0 0 448 512" aria-hidden="true" focusable="false"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>`;

// The scroll buttons are a mouse convenience for overflowing tab lists; keyboard users move with
// the arrow keys (which scroll the focused tab into view), so the buttons stay out of the tab order.
const tabsTemplate = document.createElement("template");
tabsTemplate.innerHTML = `
	<div class="tabs" data-overflow="none">
		<div class="tabs__tabs">
			<button type="button" class="tabs__control tabs__control--left" aria-hidden="true" tabindex="-1">${angleDownIcon}</button>
			<ul class="tabs__nav" role="tablist"></ul>
			<button type="button" class="tabs__control tabs__control--right" aria-hidden="true" tabindex="-1">${angleDownIcon}</button>
		</div>
		<div class="tabs__panels"></div>
	</div>
`;

// A tab's label and panel content. It renders nothing itself: ycl-tabs builds the tab and
// tabpanel in its own shadow root and slots this element into the panel.
export class Tab extends HTMLElement {
	get label() { return this.getAttribute("label") ?? ""; }
	set label(value) { this.setAttribute("label", value); }

	get selected() { return this.hasAttribute("selected"); }
	set selected(value) {
		if (value) this.setAttribute("selected", "");
		else this.removeAttribute("selected");
	}
}

// Tabs and panels live together in this shadow root so aria-controls/aria-labelledby can reference
// each other (ID references can't cross shadow boundaries). Slots are assigned by hand so each
// ycl-tab child can be projected into its own panel.
export class Tabs extends HTMLElement {
	#shadow;
	#observer;
	#resizeObserver;
	#tabs = [];

	static get observedAttributes() {
		return ["label"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed", slotAssignment: "manual" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "tabs")];
		this.#shadow.appendChild(document.importNode(tabsTemplate.content, true));
		this.root = this.#shadow.querySelector(".tabs");
		this.nav = this.#shadow.querySelector(".tabs__nav");
		this.panels = this.#shadow.querySelector(".tabs__panels");

		this.nav.addEventListener("click", this.clickHandler);
		this.nav.addEventListener("keydown", this.keydownHandler);
		this.nav.addEventListener("focusin", (event) => event.target.scrollIntoView({ block: "nearest", inline: "nearest" }));
		this.nav.addEventListener("scroll", this.updateOverflow, { passive: true });
		this.#shadow.querySelector(".tabs__control--left").addEventListener("click", () => this.#scrollBy(-1));
		this.#shadow.querySelector(".tabs__control--right").addEventListener("click", () => this.#scrollBy(1));

		this.#observer = new MutationObserver(this.mutationHandler);
		this.#resizeObserver = new ResizeObserver(this.updateOverflow);
	}

	connectedCallback() {
		this.#observer.observe(this, { childList: true, subtree: true, attributes: true, attributeFilter: ["label", "selected"] });
		this.#resizeObserver.observe(this.nav);
		this.#build();
	}

	disconnectedCallback() {
		this.#observer.disconnect();
		this.#resizeObserver.disconnect();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "label") {
			if (newValue) this.nav.setAttribute("aria-label", newValue);
			else this.nav.removeAttribute("aria-label");
		}
	}

	mutationHandler = (records) => {
		const own = records.filter((r) => r.target === this || r.target.parentElement === this);
		if (own.some((r) => r.type === "childList" || r.attributeName === "label")) {
			this.#build();
			return;
		}
		// An author setting [selected] on a tab selects it; the latest one set wins.
		const newlySelected = own.filter((r) => r.attributeName === "selected" && r.target.hasAttribute("selected")).pop();
		this.#update(newlySelected?.target);
	};

	clickHandler = (event) => {
		const button = event.target.closest('[role="tab"]');
		if (button) this.#select(Number(button.dataset.index));
	};

	// Automatic activation: moving between tabs with the keyboard also selects them.
	keydownHandler = (event) => {
		const button = event.target.closest('[role="tab"]');
		if (!button) return;
		const index = Number(button.dataset.index);
		const last = this.#tabs.length - 1;
		const target = {
			ArrowLeft: index === 0 ? last : index - 1,
			ArrowRight: index === last ? 0 : index + 1,
			Home: 0,
			End: last,
		}[event.key];

		if (event.key === "ArrowDown") {
			event.preventDefault();
			this.panels.querySelector(".tabs__container:not([hidden])")?.focus();
			return;
		}
		if (target === undefined) return;
		event.preventDefault();
		this.#select(target);
	};

	#select(index) {
		const tab = this.#tabs[index];
		if (!tab) return;
		this.#update(tab);
		this.nav.querySelectorAll('[role="tab"]')[index].focus();
	}

	#build() {
		this.#tabs = [...this.children].filter((child) => child.localName === "ycl-tab");
		this.nav.innerHTML = this.#tabs.map((_, i) => `
			<li class="tabs__item" role="presentation">
				<button type="button" class="tabs__link" role="tab" id="tab-${i}" aria-controls="panel-${i}" data-index="${i}"></button>
			</li>
		`).join("");
		this.panels.innerHTML = this.#tabs.map((_, i) => `
			<div class="tabs__container" role="tabpanel" id="panel-${i}" aria-labelledby="tab-${i}" tabindex="0">
				<div class="tabs__inner"><div class="tabs__content"><slot></slot></div></div>
			</div>
		`).join("");

		const buttons = this.nav.querySelectorAll('[role="tab"]');
		const slots = this.panels.querySelectorAll("slot");
		this.#tabs.forEach((tab, i) => {
			buttons[i].textContent = tab.getAttribute("label") ?? "";
			slots[i].assign(tab);
		});
		this.#update();
	}

	// Keeps exactly one tab selected, defaulting to the first, and mirrors that onto the ARIA state.
	#update(preferred) {
		const selected = preferred ?? this.#tabs.find((tab) => tab.hasAttribute("selected")) ?? this.#tabs[0];
		const buttons = this.nav.querySelectorAll('[role="tab"]');
		const panels = this.panels.querySelectorAll('[role="tabpanel"]');
		this.#tabs.forEach((tab, i) => {
			const isSelected = tab === selected;
			// Only touch the attribute when it changes, so our own writes don't re-trigger the observer forever.
			if (tab.hasAttribute("selected") !== isSelected) tab.toggleAttribute("selected", isSelected);
			buttons[i].setAttribute("aria-selected", String(isSelected));
			buttons[i].tabIndex = isSelected ? 0 : -1;
			panels[i].hidden = !isSelected;
		});
		this.updateOverflow();
	}

	#scrollBy(direction) {
		this.nav.scrollBy({ left: direction * this.nav.clientWidth / 2 });
	}

	// data-overflow tells the CSS which scroll buttons to show.
	updateOverflow = () => {
		const { scrollLeft, scrollWidth, clientWidth } = this.nav;
		const left = scrollLeft > 0;
		const right = Math.ceil(scrollLeft + clientWidth) < scrollWidth;
		this.root.dataset.overflow = left && right ? "both" : left ? "left" : right ? "right" : "none";
	};
}

// ycl-tab first, so its accessors exist by the time ycl-tabs upgrades and reads its children.
if (!customElements.get("ycl-tab")) customElements.define("ycl-tab", Tab);
if (!customElements.get("ycl-tabs")) customElements.define("ycl-tabs", Tabs);
