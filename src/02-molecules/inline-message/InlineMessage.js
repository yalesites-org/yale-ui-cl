import baseStyles from "../../styles/base.css?inline";
const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(baseStyles);

// Font Awesome Free icons (CC BY 4.0), decorative only
const svg = (path) => `<svg viewBox="0 0 512 512" aria-hidden="true" focusable="false"><path d="${path}"/></svg>`;
const icons = {
	general: svg("M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"),
	marketing: svg("M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"),
};

// Whitespace-only text (template formatting) doesn't count as content.
const hasContent = (slot) => slot.assignedNodes({ flatten: true })
	.some((node) => node.nodeType === Node.ELEMENT_NODE || node.textContent.trim());

// The icon slot's fallback is the type's default icon; authors can slot their own decorative
// icon instead, or set icon="none" for a text-only message.
const inlineMessageTemplate = document.createElement("template");
inlineMessageTemplate.innerHTML = `
	<section class="inline-message" aria-label="information">
		<div class="inline-message__inner">
			<div class="inline-message__icon"><slot name="icon"></slot></div>
			<div class="inline-message__content">
				<div class="inline-message__heading"><slot name="heading"></slot></div>
				<div class="inline-message__text"><slot></slot></div>
				<div class="inline-message__link"><slot name="link"></slot></div>
			</div>
		</div>
	</section>
`;

export class InlineMessage extends HTMLElement {
	#shadow;

	static get observedAttributes() {
		return ["type", "icon"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet];
		this.#shadow.appendChild(document.importNode(inlineMessageTemplate.content, true));
		this.iconSlot = this.#shadow.querySelector('slot[name="icon"]');
		this.iconWrapper = this.#shadow.querySelector(".inline-message__icon");

		// Hide empty wrappers so the content column's gap doesn't leave holes.
		for (const name of ["heading", "", "link"]) {
			const slot = this.#shadow.querySelector(name ? `slot[name="${name}"]` : "slot:not([name])");
			const update = () => { slot.parentElement.hidden = !hasContent(slot); };
			slot.addEventListener("slotchange", update);
			update();
		}
		this.#render();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this.#render();
	}

	#render() {
		this.iconSlot.innerHTML = icons[this.type] ?? icons.marketing;
		this.iconWrapper.hidden = this.icon === "none";
	}

	get type() { return this.getAttribute("type") || "general"; }
	set type(value) { this.setAttribute("type", value); }

	get icon() { return this.getAttribute("icon"); }
	set icon(value) {
		if (value == null) this.removeAttribute("icon");
		else this.setAttribute("icon", value);
	}
}

customElements.define("ycl-inline-message", InlineMessage);
