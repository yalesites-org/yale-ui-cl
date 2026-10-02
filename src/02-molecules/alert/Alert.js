import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

// Font Awesome Free icons (CC BY 4.0), decorative only
const svg = (viewBox, path) => `<svg viewBox="${viewBox}" aria-hidden="true" focusable="false"><path d="${path}"/></svg>`;
const icons = {
	"triangle-exclamation": svg("0 0 512 512", "M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"),
	"circle-info": svg("0 0 512 512", "M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"),
	"angle-down": svg("0 0 448 512", "M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"),
	"xmark": svg("0 0 384 512", "M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"),
};

const STORAGE_PREFIX = "ys-alert-id-";
const STATES = ["expanded", "collapsed", "dismissed"];

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
		return ["type", "state"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
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
		this.#render();
	}

	#render() {
		const emergency = this.type === "emergency";
		const iconName = { emergency: "triangle-exclamation", announcement: "circle-info" }[this.type];
		this.icon.innerHTML = iconName ? icons[iconName] : "";
		this.icon.hidden = !iconName;
		this.alert.setAttribute("aria-label", emergency ? "Emergency alert" : "Announcement");

		this.toggle.querySelector(".visually-hidden").textContent = emergency ? "Hide alert details" : "Close alert";
		this.toggle.querySelector(".alert__toggle-icon").innerHTML = icons[emergency ? "angle-down" : "xmark"];
		// Only emergency alerts collapse; the others are dismissed, so there's nothing to expand.
		if (emergency) {
			this.toggle.setAttribute("aria-expanded", String(this.state !== "collapsed"));
			this.toggle.setAttribute("aria-controls", "text link");
		} else {
			this.toggle.removeAttribute("aria-expanded");
			this.toggle.removeAttribute("aria-controls");
		}
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

	get state() { return this.getAttribute("state") || "expanded"; }
	set state(value) { this.setAttribute("state", value); }
}

customElements.define("ycl-alert", Alert);
