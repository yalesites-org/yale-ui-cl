import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";
// The color and size tokens live on :root in the document stylesheet consumers load; load them here
// too so computed colors are the real ones.
import "@yalesites-org/tokens/build/css/tokens.css";
import "./SiteFooter.js";
import "../../02-molecules/link-group/LinkGroup.js";
import "../../02-molecules/social-links/SocialLinks.js";
import "../../01-atoms/text-link/Link.js";
import { mount, rgb, settle, shadowOf } from "../../../test/helpers.js";

const ACCESSIBILITY_URL = "https://usability.yale.edu/web-accessibility/accessibility-yale";
const PRIVACY_URL = "https://privacy.yale.edu/resources/privacy-statement";

const legalLink = (element, name) => shadowOf(element).querySelector(`[data-link="${name}"]`);
const region = (element, name) => shadowOf(element).querySelector(`.site-footer__${name}`);

// WCAG relative luminance and contrast ratio, from a computed rgb() string.
const luminance = (rgb) => {
	const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map((v) => {
		const c = Number(v) / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
};

describe("ycl-site-footer", () => {
	it("renders a footer landmark", () => {
		const element = mount(`<ycl-site-footer></ycl-site-footer>`);
		expect(shadowOf(element).querySelector("footer")).not.toBeNull();
	});

	it("always shows the Yale wordmark, white and linked to yale.edu", () => {
		const element = mount(`<ycl-site-footer></ycl-site-footer>`);
		const wordmark = shadowOf(element).querySelector("ycl-wordmark");
		expect(wordmark).not.toBeNull();
		expect(wordmark.getAttribute("color")).toBe("white");
		expect(wordmark.href).toBe("https://www.yale.edu");
	});

	it("always shows the accessibility and privacy links, with Yale's pages by default", () => {
		const element = mount(`<ycl-site-footer></ycl-site-footer>`);
		const accessibility = legalLink(element, "accessibility");
		const privacy = legalLink(element, "privacy");
		expect(accessibility.textContent.trim()).toBe("Accessibility at Yale");
		expect(accessibility.getAttribute("href")).toBe(ACCESSIBILITY_URL);
		expect(privacy.textContent.trim()).toBe("Privacy Policy");
		expect(privacy.getAttribute("href")).toBe(PRIVACY_URL);
	});

	it("lets the accessibility and privacy hrefs be overridden, falling back when cleared", () => {
		const element = mount(`<ycl-site-footer accessibility-href="/a11y" privacy-href="/privacy"></ycl-site-footer>`);
		expect(legalLink(element, "accessibility").getAttribute("href")).toBe("/a11y");
		expect(legalLink(element, "privacy").getAttribute("href")).toBe("/privacy");
		element.setAttribute("privacy-href", "");
		element.removeAttribute("accessibility-href");
		expect(legalLink(element, "privacy").getAttribute("href")).toBe(PRIVACY_URL);
		expect(legalLink(element, "accessibility").getAttribute("href")).toBe(ACCESSIBILITY_URL);
	});

	it("shows the YaleSites copyright line for the current year", () => {
		const element = mount(`<ycl-site-footer></ycl-site-footer>`);
		expect(region(element, "copyright").textContent.trim()).toBe(`Copyright © ${new Date().getFullYear()} Yale University. All rights reserved.`);
	});

	it("hides the optional regions until something is slotted into them", async () => {
		const element = mount(`<ycl-site-footer></ycl-site-footer>`);
		await settle();
		expect(region(element, "content").hidden).toBe(true);
		expect(region(element, "links").hidden).toBe(true);
		expect(region(element, "social").hidden).toBe(true);

		element.insertAdjacentHTML("beforeend", `
			<p>149 Elm Street</p>
			<ycl-link-group slot="links"><a slot="links-one" href="#">One</a></ycl-link-group>
			<ycl-social-links slot="social" facebook="https://facebook.com"></ycl-social-links>
		`);
		await settle();
		expect(region(element, "content").hidden).toBe(false);
		expect(region(element, "links").hidden).toBe(false);
		expect(region(element, "social").hidden).toBe(false);
		expect(shadowOf(element).querySelector('slot[name="links"]').assignedElements()[0].localName).toBe("ycl-link-group");
		expect(shadowOf(element).querySelector('slot[name="social"]').assignedElements()[0].localName).toBe("ycl-social-links");
	});

	it("shows the optional regions when the footer is parsed with its content inside", async () => {
		const element = mount(`<ycl-site-footer><p>149 Elm Street</p><ycl-link-group slot="links"><a slot="links-one" href="#">One</a></ycl-link-group><ycl-social-links slot="social" facebook="https://facebook.com"></ycl-social-links></ycl-site-footer>`);
		await settle();
		expect(region(element, "content").hidden).toBe(false);
		expect(region(element, "links").hidden).toBe(false);
		expect(region(element, "social").hidden).toBe(false);
	});

	it("stacks into one column when narrow and splits into two when wide", async () => {
		const element = mount(`<ycl-site-footer style="width: 375px"><p>Text</p><ycl-link-group slot="links"><a slot="links-one" href="#">One</a></ycl-link-group></ycl-site-footer>`);
		await settle();
		const columns = () => getComputedStyle(region(element, "primary")).gridTemplateColumns.split(" ").length;
		expect(columns()).toBe(1);
		element.style.width = "1024px";
		await settle();
		expect(columns()).toBe(2);
	});

	it("meets WCAG AA contrast for its text and links", () => {
		const element = mount(`<ycl-site-footer></ycl-site-footer>`);
		const background = getComputedStyle(shadowOf(element).querySelector("footer")).backgroundColor;
		for (const node of [legalLink(element, "accessibility"), legalLink(element, "privacy"), region(element, "copyright")]) {
			expect(contrast(getComputedStyle(node).color, background)).toBeGreaterThanOrEqual(4.5);
		}
	});

	it("gives slotted text links a descender halo in the footer's blue, not the page's white", async () => {
		const element = mount(`<ycl-site-footer><ycl-link-group slot="links"><ycl-text-link slot="links-one" href="#">Directory</ycl-text-link></ycl-link-group></ycl-site-footer>`);
		await settle();
		const background = getComputedStyle(shadowOf(element).querySelector("footer")).backgroundColor;
		const link = shadowOf(element.querySelector("ycl-text-link")).querySelector("a");
		const halo = getComputedStyle(link).textShadow;
		expect(halo).not.toBe("none");
		expect(halo.startsWith(background)).toBe(true);
	});

	it("themes a slotted link group for the blue background: light blue hover and dividers", async () => {
		const element = mount(`<ycl-site-footer style="width: 1024px"><ycl-link-group slot="links"><a slot="links-one" href="#">Plain</a><ycl-text-link slot="links-two" href="#">Text link</ycl-text-link></ycl-link-group></ycl-site-footer>`);
		await settle();
		const expected = rgb(getComputedStyle(legalLink(element, "accessibility")).getPropertyValue("--color-link-hover"));
		const group = element.querySelector("ycl-link-group");
		for (const column of shadowOf(group).querySelectorAll(".link-group__links-column")) {
			expect(getComputedStyle(column).borderLeftColor).toBe(expected);
		}
		const plain = element.querySelector("a");
		await userEvent.hover(plain);
		expect(getComputedStyle(plain).color).toBe(expected);
		const textLink = element.querySelector("ycl-text-link");
		await userEvent.hover(textLink);
		// ycl-text-link animates its color, so wait for the transition to finish.
		await expect.poll(() => getComputedStyle(shadowOf(textLink).querySelector("a")).color).toBe(expected);
	});

	// The gutter padding itself is checked with the other components in src/styles/shadow.test.js.
	it("caps its content at the site width plus the site gutter on each side", async () => {
		const element = mount(`<ycl-site-footer style="width: 4000px"></ycl-site-footer>`);
		await settle();
		const inner = region(element, "inner");
		const probe = document.createElement("div");
		probe.style.width = "var(--size-component-layout-width-site)";
		inner.append(probe);
		const site = probe.getBoundingClientRect().width;
		probe.remove();
		const style = getComputedStyle(inner);
		expect(parseFloat(style.paddingLeft)).toBeGreaterThan(0);
		expect(inner.getBoundingClientRect().width).toBe(site + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight));
	});

	it("shows a visible focus ring on its links that contrasts with the background", async () => {
		const element = mount(`<ycl-site-footer></ycl-site-footer>`);
		const background = getComputedStyle(shadowOf(element).querySelector("footer")).backgroundColor;
		const link = legalLink(element, "accessibility");
		// Tab past the wordmark's link to the first legal link.
		await userEvent.tab();
		await userEvent.tab();
		expect(shadowOf(element).activeElement).toBe(link);
		const style = getComputedStyle(link);
		expect(style.outlineStyle).toBe("solid");
		expect(parseFloat(style.outlineWidth)).toBeGreaterThan(0);
		expect(contrast(style.outlineColor, background)).toBeGreaterThanOrEqual(3);
	});
});
