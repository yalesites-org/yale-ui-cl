import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./social-links.css?inline";
import { iconSvg } from "../../01-atoms/icons/icons.js";

// Each platform's icon is the registry icon named after its attribute, and is decorative: the
// platform name is announced from visually hidden text instead. Listed in the order the YaleSites
// footer renders them.
const platforms = [
	{ attribute: "x-twitter", name: "X (formerly Twitter)" },
	{ attribute: "facebook", name: "Facebook" },
	{ attribute: "youtube", name: "YouTube" },
	{ attribute: "instagram", name: "Instagram" },
	{ attribute: "weibo", name: "Weibo" },
	{ attribute: "linkedin", name: "LinkedIn" },
	{ attribute: "bluesky", name: "Bluesky" },
];

const socialLinksTemplate = document.createElement("template");
socialLinksTemplate.innerHTML = `
	<div class="social-links">
		<ul class="social-links__list"></ul>
	</div>
`;

// Each platform is an attribute holding its URL; platforms without one aren't rendered.
/**
 * Icon links to social media profiles. Each platform attribute holds a URL; platforms without one are not shown.
 * @attr {string} x-twitter - X (formerly Twitter) URL.
 * @attr {string} facebook - Facebook URL.
 * @attr {string} youtube - YouTube URL.
 * @attr {string} instagram - Instagram URL.
 * @attr {string} weibo - Weibo URL.
 * @attr {string} linkedin - LinkedIn URL.
 * @attr {string} bluesky - Bluesky URL.
 */
export class SocialLinks extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return platforms.map((platform) => platform.attribute);
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "social-links")];
		this.#shadow.appendChild(document.importNode(socialLinksTemplate.content, true));
		this.list = this.#shadow.querySelector(".social-links__list");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		this.#render();
	}

	#render() {
		this.list.replaceChildren(...platforms
			.filter((platform) => this.getAttribute(platform.attribute))
			.map((platform) => {
				const item = document.createElement("li");
				item.className = "social-links__item";
				item.innerHTML = `<a class="social-links__link"><span class="visually-hidden">${platform.name}</span>${iconSvg(platform.attribute, "social-links__icon")}</a>`;
				item.firstElementChild.setAttribute("href", this.getAttribute(platform.attribute));
				return item;
			}));
	}
}

if (!customElements.get("ycl-social-links")) customElements.define("ycl-social-links", SocialLinks);
