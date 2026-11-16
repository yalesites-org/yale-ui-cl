import { describe, expect, it } from "vitest";
import "./BannerContent.js";
import "../../01-atoms/headings/Heading.js";
import "../../01-atoms/cta/Cta.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const markup = (attrs = "") => `
	<ycl-banner-content${attrs}>
		<ycl-heading level="2" slot="heading">Heading</ycl-heading>
		<p>Some text</p>
		<ycl-cta-link slot="actions" href="/one" variant="filled">One</ycl-cta-link>
		<ycl-cta-link slot="actions" href="/two" variant="outline">Two</ycl-cta-link>
	</ycl-banner-content>`;

const part = (element, selector) => shadowOf(element).querySelector(selector);
const assigned = (element, name) => {
	const selector = name ? `slot[name="${name}"]` : "slot:not([name])";
	return part(element, selector).assignedElements();
};

describe("ycl-banner-content", () => {
	it("puts the heading, text and every action in their own slots", async () => {
		const element = mount(markup());
		await settle();
		expect(assigned(element, "heading").map((el) => el.localName)).toEqual(["ycl-heading"]);
		expect(assigned(element).map((el) => el.localName)).toEqual(["p"]);
		expect(assigned(element, "actions").map((el) => el.getAttribute("href"))).toEqual(["/one", "/two"]);
	});

	it("defaults to the primary theme, contained placement and left-aligned actions", () => {
		const element = mount(markup());
		const root = part(element, ".banner-content");
		expect(root.dataset.componentTheme).toBe("primary");
		expect(root.dataset.bannerPlacement).toBe("contained");
		expect(part(element, ".banner-content__actions").dataset.buttonAlignment).toBe("left");
	});

	it("sets theme, placement and button alignment from attributes, and follows changes", () => {
		const element = mount(markup(' theme="accent-2" placement="full" button-alignment="center"'));
		const root = part(element, ".banner-content");
		expect(root.dataset.componentTheme).toBe("accent-2");
		expect(root.dataset.bannerPlacement).toBe("full");
		element.setAttribute("placement", "contained");
		element.removeAttribute("theme");
		expect(root.dataset.bannerPlacement).toBe("contained");
		expect(root.dataset.componentTheme).toBe("primary");
		expect(part(element, ".banner-content__actions").dataset.buttonAlignment).toBe("center");
	});

	it("ignores an unknown placement", () => {
		const root = part(mount(markup(' placement="sideways"')), ".banner-content");
		expect(root.dataset.bannerPlacement).toBe("contained");
	});

	it("hides the actions area until something is slotted in it", async () => {
		const element = mount(`<ycl-banner-content><ycl-heading level="2" slot="heading">Only a heading</ycl-heading></ycl-banner-content>`);
		await settle();
		expect(part(element, ".banner-content__actions").hidden).toBe(true);
		element.append(Object.assign(document.createElement("ycl-cta-link"), { slot: "actions", textContent: "Go" }));
		await settle();
		expect(part(element, ".banner-content__actions").hidden).toBe(false);
	});

	it("is a block, and a contained placement boxes the whole panel, background included", () => {
		const contained = mount(markup());
		const full = mount(markup(' placement="full"'));
		expect(getComputedStyle(contained).display).toBe("block");
		const panelWidth = (el) => getComputedStyle(part(el, ".banner-content")).maxWidth;
		expect(panelWidth(contained)).not.toBe("none");
		expect(panelWidth(full)).toBe("none");
	});

	it("leaves a gap between the text and the actions", async () => {
		const element = mount(markup());
		await settle();
		const text = part(element, ".banner-content__text").getBoundingClientRect();
		const actions = part(element, ".banner-content__actions").getBoundingClientRect();
		expect(actions.top - text.bottom).toBeGreaterThanOrEqual(16);
	});

	it("insets the contained text by the site gutter", () => {
		const element = mount(markup());
		const probe = document.createElement("div");
		probe.style.paddingLeft = "var(--banner-content-gutter)";
		part(element, ".banner-content").append(probe);
		const gutter = getComputedStyle(probe).paddingLeft;
		expect(getComputedStyle(part(element, ".banner-content__inner")).paddingLeft).toBe(gutter);
	});

	it.each([
		["left", "start"],
		["center", "center"],
		["right", "end"],
	])("moves the actions to the %s when button-alignment is %s", async (alignment, edge) => {
		const element = mount(markup(` button-alignment="${alignment}"`));
		await settle();
		const panel = part(element, ".banner-content__inner").getBoundingClientRect();
		const first = element.querySelector('[slot="actions"]').getBoundingClientRect();
		const last = [...element.querySelectorAll('[slot="actions"]')].pop().getBoundingClientRect();
		const leftSpace = first.left - panel.left;
		const rightSpace = panel.right - last.right;
		if (edge === "start") expect(leftSpace).toBeLessThan(rightSpace);
		if (edge === "end") expect(rightSpace).toBeLessThan(leftSpace);
		if (edge === "center") expect(Math.abs(leftSpace - rightSpace)).toBeLessThan(2);
	});
});
