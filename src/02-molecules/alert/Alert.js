import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./alert.css?inline";
import { iconSvg } from "../../01-atoms/icons/icons.js";

const STORAGE_PREFIX = "ys-alert-id-";
const STATES = ["expanded", "collapsed", "dismissed"];
const DEFAULT_LABELS = { emergency: "Emergency alert", announcement: "Announcement", marketing: "Marketing alert" };

// Storage only remembers state between page loads; when it's blocked (private browsing, policy)
// or full, the alert must keep working with its state living in the attribute alone.
const readState = (key) => {
	try { return localStorage.getItem(key); } catch { return null; }
};
const writeState = (key, value) => {
	try { localStorage.setItem(key, value); } catch { /* state is already on the element */ }
};

// Whitespace-only text (template formatting) doesn't count as content.
const hasContent = (slot) => slot.assignedNodes({ flatten: true })
	.some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());

const alertTemplate = document.createElement("template");
alertTemplate.innerHTML = `
	<section class="alert">
		<div class="alert__inner">
			<div class="alert__icon"></div>
			<div class="alert__content">
				<div class="alert__content-inner">
					<div class="alert__heading"><slot name="heading"></slot></div>
					<div class="alert__text" id="text"><slot></slot></div>
				</div>
				<div class="alert__link" id="link"><slot name="link"></slot></div>
			</div>
			<button class="alert__toggle" type="button"><span class="visually-hidden"></span><span class="alert__toggle-icon"></span></button>
		</div>
	</section>
`;

export class Alert extends HTMLElement {
	#shadow;
	#restored = false;

	static get observedAttributes() {
		return ["type", "state", "label"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "open" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "alert")];
		this.#shadow.appendChild(document.importNode(alertTemplate.content, true));
		this.alert = this.#shadow.querySelector(".alert");
		this.icon = this.#shadow.querySelector(".alert__icon");
		this.toggle = this.#shadow.querySelector(".alert__toggle");
		this.toggle.addEventListener("click", this.clickHandler);

		// Hide empty wrappers so their margins don't leave gaps.
		for (const [selector, slotSelector] of [[".alert__text", "slot:not([name])"], [".alert__link", 'slot[name="link"]']]) {
			const slot = this.#shadow.querySelector(slotSelector);
			const wrapper = this.#shadow.querySelector(selector);
			const update = () => { wrapper.hidden = !hasContent(slot); };
			slot.addEventListener("slotchange", update);
			update();
		}
		this.#render();
	}

	// Remembered state wins over the authored attribute, as in the YaleSites alert.
	connectedCallback() {
		if (this.#restored) return;
		this.#restored = true;
		const saved = this.storageKey && readState(this.storageKey);
		if (STATES.includes(saved)) this.state = saved;
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "label") this.#renderLabel();
		else this.#render();
	}

	#render() {
		const emergency = this.type === "emergency";
		const iconName = { emergency: "triangle-exclamation", announcement: "circle-info" }[this.type];
		this.icon.innerHTML = iconName ? iconSvg(iconName) : "";
		this.icon.hidden = !iconName;
		this.#renderLabel();

		this.toggle.querySelector(".visually-hidden").textContent = emergency ? "Hide alert details" : "Close alert";
		this.toggle.querySelector(".alert__toggle-icon").innerHTML = iconSvg(emergency ? "angle-down" : "xmark");
		// Only emergency alerts collapse; the others are dismissed, so there's nothing to expand.
		if (emergency) {
			this.toggle.setAttribute("aria-expanded", String(this.state !== "collapsed"));
			this.toggle.setAttribute("aria-controls", "text link");
		} else {
			this.toggle.removeAttribute("aria-expanded");
			this.toggle.removeAttribute("aria-controls");
		}
	}

	// The section is a landmark, and landmarks of the same kind need distinct names, so each type gets
	// its own default and authors can set label when a page has more than one of a type.
	#renderLabel() {
		this.alert.setAttribute("aria-label", this.label || DEFAULT_LABELS[this.type] || DEFAULT_LABELS.announcement);
	}

	clickHandler = () => {
		if (this.type === "emergency") {
			this.state = this.state === "collapsed" ? "expanded" : "collapsed";
		} else {
			// Only animate user dismissals, not alerts restored as dismissed on load.
			this.alert.classList.add("alert__animate");
			this.state = "dismissed";
		}
		if (this.storageKey) writeState(this.storageKey, this.state);
	};

	get storageKey() {
		const id = this.getAttribute("alert-id");
		return id ? STORAGE_PREFIX + id : null;
	}

	get type() { return this.getAttribute("type") || "announcement"; }
	set type(value) { this.setAttribute("type", value); }

	get label() { return this.getAttribute("label"); }
	set label(value) { this.setAttribute("label", value); }

	get state() { return this.getAttribute("state") || "expanded"; }
	set state(value) { this.setAttribute("state", value); }
}

if (!customElements.get("ycl-alert")) customElements.define("ycl-alert", Alert);
