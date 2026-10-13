import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./inline-message.css?inline";
import { iconSvg } from "../../01-atoms/icons/icons.js";

// Each type's default icon, from the shared icon registry.
const typeIcons = { general: "circle-info", marketing: "circle-exclamation" };

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
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "inline-message")];
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
		this.iconSlot.innerHTML = iconSvg(typeIcons[this.type] ?? typeIcons.marketing);
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

if (!customElements.get("ycl-inline-message")) customElements.define("ycl-inline-message", InlineMessage);
