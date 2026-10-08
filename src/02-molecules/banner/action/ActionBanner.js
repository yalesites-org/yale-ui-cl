import { baseSheet, componentSheet } from "../../../styles/shadow.js";
import componentStyles from "./action-banner.css?inline";

const actionBannerTemplate = document.createElement("template");
actionBannerTemplate.innerHTML = `
	<div class="cta-banner">
		<div class="cta-banner__content-wrapper">
			<div class="cta-banner__image"><slot name="image"></slot></div>
			<div class="cta-banner__content">
				<div class="cta-banner__overlay_image" hidden></div>
				<div class="cta-banner__outer-wrap">
					<div class="cta-banner__wrap">
						<div class="cta-banner__text">
							<div class="cta-banner__heading"><slot name="heading"></slot></div>
							<div class="cta-banner__snippet"><slot></slot></div>
						</div>
						<div class="cta-banner__button-group" hidden><slot name="actions"></slot></div>
					</div>
				</div>
			</div>
		</div>
	</div>
`;

// Host attributes are mirrored onto the inner wrapper as data attributes with their defaults
// filled in, because the default button alignment depends on the layout and CSS can't express
// "attribute absent" defaults that cleanly.
export class ActionBanner extends HTMLElement {
	#shadow;
	#banner;
	#overlay;
	#buttonGroup;

	static get observedAttributes() {
		return ["theme", "layout", "button-alignment", "width", "overlay-image"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "action-banner")];
		this.#shadow.appendChild(document.importNode(actionBannerTemplate.content, true));
		this.#banner = this.#shadow.querySelector(".cta-banner");
		this.#overlay = this.#shadow.querySelector(".cta-banner__overlay_image");
		this.#buttonGroup = this.#shadow.querySelector(".cta-banner__button-group");
		const actionsSlot = this.#shadow.querySelector('slot[name="actions"]');
		// An empty button group would still take up a flex gap.
		actionsSlot.addEventListener("slotchange", () => {
			this.#buttonGroup.hidden = actionsSlot.assignedElements().length === 0;
		});
		this.#render();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this.#render();
	}

	#render() {
		const layout = this.getAttribute("layout") || "bottom";
		const alignment = this.getAttribute("button-alignment") || (layout === "bottom" ? "right" : "left");
		this.#banner.dataset.componentTheme = this.getAttribute("theme") || "one";
		this.#banner.dataset.bannerContentLayout = layout;
		this.#banner.dataset.bannerButtonAlignment = alignment;
		this.#banner.dataset.bannerWidth = this.getAttribute("width") || "site";
		this.#buttonGroup.dataset.buttonAlignment = alignment;

		const overlayImage = this.getAttribute("overlay-image");
		this.#overlay.hidden = !overlayImage;
		if (overlayImage) this.#overlay.style.setProperty("--overlay-bg-image", `url(${JSON.stringify(overlayImage)})`);
		else this.#overlay.style.removeProperty("--overlay-bg-image");
	}
}

if (!customElements.get("ycl-action-banner")) customElements.define("ycl-action-banner", ActionBanner);
