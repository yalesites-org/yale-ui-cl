import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./site-footer.css?inline";
import "../../01-atoms/wordmark/Wordmark.js";

// The footer's two guardrails: the Yale wordmark and these two links are always shown. A page may
// point the links at its own pages, but can't remove them.
const legalLinks = [
	{ name: "accessibility", label: "Accessibility at Yale", href: "https://usability.yale.edu/web-accessibility/accessibility-yale" },
	{ name: "privacy", label: "Privacy policy", href: "https://privacy.yale.edu/resources/privacy-statement" },
];

const siteFooterTemplate = document.createElement("template");
siteFooterTemplate.innerHTML = `
	<footer class="site-footer">
		<div class="site-footer__inner">
			<div class="site-footer__primary">
				<div class="site-footer__brand">
					<ycl-wordmark class="site-footer__wordmark" color="white"></ycl-wordmark>
					<div class="site-footer__content" hidden><slot></slot></div>
				</div>
				<div class="site-footer__links" hidden><slot name="links"></slot></div>
			</div>
			<div class="site-footer__social" hidden><slot name="social"></slot></div>
			<div class="site-footer__secondary">
				<ul class="site-footer__legal">
					${legalLinks.map(({ name, label }) => `<li><a class="site-footer__legal-link" data-link="${name}">${label}</a></li>`).join("")}
				</ul>
				<p class="site-footer__copyright">© <span class="site-footer__year"></span> Yale University. All rights reserved.</p>
			</div>
		</div>
	</footer>
`;

/**
 * The Yale site footer. The Yale wordmark, the accessibility and privacy links and the copyright line are always shown;
 * everything else is optional. It renders its own <footer> landmark, so use it as the page footer rather than inside
 * another <footer>, in a block-level, full-width context (its layout follows its own width).
 * @attr {string} accessibility-href - Accessibility link target. Defaults to Yale's accessibility page; empty uses the default.
 * @attr {string} privacy-href - Privacy link target. Defaults to Yale's privacy statement; empty uses the default.
 * @slot - Free content beside the wordmark, such as an address or a short paragraph.
 * @slot links - Footer links, usually a ycl-link-group.
 * @slot social - Social media links, usually a ycl-social-links.
 */
export class SiteFooter extends HTMLElement {
	#shadow;

	static get observedAttributes() {
		return legalLinks.map(({ name }) => `${name}-href`);
	}

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "site-footer")];
		this.#shadow.appendChild(document.importNode(siteFooterTemplate.content, true));
		this.#shadow.querySelector(".site-footer__year").textContent = new Date().getFullYear();
		// An optional region shows only when something is slotted into it, so an empty one leaves no gap.
		this.#shadow.querySelectorAll("slot").forEach((slot) => {
			slot.addEventListener("slotchange", () => {
				slot.parentElement.hidden = slot.assignedNodes({ flatten: true }).every((node) => node.nodeType === Node.TEXT_NODE && !node.textContent.trim());
			});
		});
		this.#renderLinks();
	}

	attributeChangedCallback() {
		this.#renderLinks();
	}

	#renderLinks() {
		for (const { name, href } of legalLinks) {
			this.#shadow.querySelector(`[data-link="${name}"]`).setAttribute("href", this.getAttribute(`${name}-href`) || href);
		}
	}
}

if (!customElements.get("ycl-site-footer")) customElements.define("ycl-site-footer", SiteFooter);
