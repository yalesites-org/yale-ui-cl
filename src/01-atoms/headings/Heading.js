import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./heading.css?inline";
import { iconSvg } from "../icons/icons.js";

// The hN element itself is created in JS, because its tag has to follow the level attribute.
// The prefix is exposed as a part so components that use this atom can restyle it.
const headingTemplate = document.createElement("template");
headingTemplate.innerHTML = `
	<span class="heading__prefix" part="prefix" hidden></span>
	<span class="heading__prefix-icon" hidden></span>
	<a class="heading-link" hidden></a>
	<slot></slot>
`;

const levels = ["1", "2", "3", "4", "5", "6"];

/**
 * A heading (h1 to h6) with an optional prefix, prefix icon and link.
 * @attr {"1"|"2"|"3"|"4"|"5"|"6"} level - The heading level. Defaults to 2.
 * @attr {"h1"|"h2"|"h3"|"h4"|"h5"|"h6"|"1"|"2"|"3"|"4"|"5"|"6"} appearance - Look of another level, without changing the outline level.
 * @attr {string} prefix - Short text shown before the heading.
 * @attr {string} prefix-icon - Name of an icon (see ycl-icon) shown before the heading.
 * @attr {string} href - Makes the heading text a link to this URL.
 * @attr {string} id - Makes the heading a link target; it also gets tabindex="-1" so focus can land on it.
 * @slot - The heading text.
 * @csspart prefix - The prefix text.
 */
export class Heading extends HTMLElement {
	#shadow;
	static get observedAttributes() {
		return ["level", "prefix", "prefix-icon", "href", "id"];
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "heading")];
		const content = document.importNode(headingTemplate.content, true);
		this.prefixIcon = content.querySelector(".heading__prefix-icon");
		this.prefixText = content.querySelector(".heading__prefix");
		this.link = content.querySelector(".heading-link");
		this.slotElement = content.querySelector("slot");
		this.heading = document.createElement("h2");
		this.heading.append(content);
		this.#shadow.append(this.heading);
		this.#render();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "id") {
			// An id makes the heading a fragment target. Headings can't take focus, and a browser
			// following a link to an unfocusable target sends focus back to the top of the page,
			// so give it tabindex="-1" (unless the author set their own).
			if (newValue && !this.hasAttribute("tabindex")) this.setAttribute("tabindex", "-1");
			return;
		}
		this.#render();
	}

	#render() {
		const level = levels.includes(this.getAttribute("level")) ? this.getAttribute("level") : "2";
		if (this.heading.localName !== `h${level}`) {
			const heading = document.createElement(`h${level}`);
			heading.append(...this.heading.childNodes);
			this.heading.replaceWith(heading);
			this.heading = heading;
		}
		// Type styles key off the host's level and appearance attributes in CSS, so appearance can
		// differ from the outline level.
		this.heading.className = "heading";

		const prefix = this.getAttribute("prefix");
		this.prefixText.textContent = prefix ?? "";
		this.prefixText.hidden = !prefix;

		const icon = iconSvg(this.getAttribute("prefix-icon"), "heading__icon");
		this.prefixIcon.innerHTML = icon;
		this.prefixIcon.hidden = !icon;

		const href = this.getAttribute("href");
		if (href) {
			this.link.href = href;
			this.link.hidden = false;
			this.link.append(this.slotElement);
		} else {
			this.link.removeAttribute("href");
			this.link.hidden = true;
			this.heading.append(this.slotElement);
		}
	}

	get level() { return Number(this.getAttribute("level") ?? 2); }
	set level(value) { this.setAttribute("level", value); }

	get href() { return this.getAttribute("href"); }
	set href(value) {
		if (value) this.setAttribute("href", value);
		else this.removeAttribute("href");
	}
}

if (!customElements.get("ycl-heading")) customElements.define("ycl-heading", Heading);
