import { afterEach, describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";
import "./SiteHeader.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const markup = `
	<ycl-site-header site-name="Office of Example" href="/example">
		<ycl-nav-menu>
			<ycl-nav-menu-item label="Home" href="/"></ycl-nav-menu-item>
			<ycl-nav-menu-item label="About">
				<ycl-nav-menu-item label="History" href="/about/history"></ycl-nav-menu-item>
			</ycl-nav-menu-item>
			<ycl-nav-menu-item label="Contact" href="/contact"></ycl-nav-menu-item>
		</ycl-nav-menu>
	</ycl-site-header>`;

const root = (header) => shadowOf(header);
const toggle = (header) => root(header).querySelector(".site-header__toggle");
const panel = (header) => root(header).querySelector(".site-header__nav");
const menu = (header) => header.querySelector("ycl-nav-menu");
const visible = (el) => el.checkVisibility();

const { innerWidth, innerHeight } = window;
const desktop = () => page.viewport(1280, 800);
const mobile = () => page.viewport(375, 800);

afterEach(async () => {
	await page.viewport(innerWidth, innerHeight);
});

describe("ycl-site-header", () => {
	it("renders a banner header with the Yale wordmark and a linked site name", async () => {
		await desktop();
		const header = mount(markup);
		await settle();
		const banner = root(header).querySelector("header");
		expect(banner).not.toBeNull();
		expect(banner.querySelector("ycl-wordmark")).not.toBeNull();
		const name = banner.querySelector(".site-header__name");
		expect(name.localName).toBe("a");
		expect(name.textContent).toBe("Office of Example");
		expect(name.getAttribute("href")).toBe("/example");
	});

	it("links the site name to / by default and follows attribute changes", async () => {
		const header = mount(`<ycl-site-header site-name="One"></ycl-site-header>`);
		const name = () => root(header).querySelector(".site-header__name");
		expect(name().getAttribute("href")).toBe("/");
		header.setAttribute("site-name", "Two");
		header.setAttribute("href", "/two");
		expect(name().textContent).toBe("Two");
		expect(name().getAttribute("href")).toBe("/two");
	});

	it("shows the navigation menu horizontally with no toggle on wide screens", async () => {
		await desktop();
		const header = mount(markup);
		await settle();
		expect(menu(header).getAttribute("layout")).toBe("horizontal");
		expect(root(header).querySelector("slot").assignedElements()).toEqual([menu(header)]);
		expect(visible(toggle(header))).toBe(false);
		expect(visible(panel(header))).toBe(true);
	});

	it("collapses the menu behind a Button toggle on narrow screens, in its vertical layout", async () => {
		await mobile();
		const header = mount(markup);
		await settle();
		const button = toggle(header);
		expect(button.localName).toBe("ycl-button");
		expect(button.textContent.trim()).toBe("Menu");
		expect(visible(button)).toBe(true);
		expect(button.getAttribute("expanded")).toBe("false");
		expect(menu(header).getAttribute("layout")).toBe("vertical");
		expect(visible(panel(header))).toBe(false);

		button.click();
		expect(button.getAttribute("expanded")).toBe("true");
		expect(visible(panel(header))).toBe(true);

		button.click();
		expect(button.getAttribute("expanded")).toBe("false");
		expect(visible(panel(header))).toBe(false);
	});

	it("closes the open mobile menu on Escape and returns focus to the toggle", async () => {
		await mobile();
		const header = mount(markup);
		await settle();
		toggle(header).focus();
		toggle(header).click();
		await userEvent.tab();
		expect(document.activeElement).toBe(menu(header));
		await userEvent.keyboard("{Escape}");
		expect(toggle(header).getAttribute("expanded")).toBe("false");
		expect(visible(panel(header))).toBe(false);
		expect(root(header).activeElement).toBe(toggle(header));
	});

	it("lets the navigation menu's Escape close its dropdown before the mobile menu", async () => {
		await mobile();
		const header = mount(markup);
		await settle();
		toggle(header).click();
		const dropdown = shadowOf(menu(header)).querySelector(".nav-menu__toggle");
		dropdown.focus();
		dropdown.click();
		expect(dropdown.getAttribute("aria-expanded")).toBe("true");
		await userEvent.keyboard("{Escape}");
		expect(dropdown.getAttribute("aria-expanded")).toBe("false");
		expect(toggle(header).getAttribute("expanded")).toBe("true");
		await userEvent.keyboard("{Escape}");
		expect(toggle(header).getAttribute("expanded")).toBe("false");
	});

	it("leaves Escape alone while the mobile menu is closed", async () => {
		await mobile();
		const header = mount(markup);
		await settle();
		const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true, cancelable: true });
		toggle(header).dispatchEvent(event);
		expect(event.defaultPrevented).toBe(false);
	});

	it("switches layouts and closes the mobile menu when the screen widens", async () => {
		await mobile();
		const header = mount(markup);
		await settle();
		toggle(header).click();
		await desktop();
		await expect.poll(() => menu(header).getAttribute("layout")).toBe("horizontal");
		expect(toggle(header).getAttribute("expanded")).toBe("false");
		expect(visible(panel(header))).toBe(true);
		await mobile();
		await expect.poll(() => menu(header).getAttribute("layout")).toBe("vertical");
		expect(visible(panel(header))).toBe(false);
	});

	it("renders no site-name link when the site has no name", () => {
		const header = mount(`<ycl-site-header></ycl-site-header>`);
		expect(visible(root(header).querySelector(".site-header__name"))).toBe(false);
		header.setAttribute("site-name", "Named");
		expect(visible(root(header).querySelector(".site-header__name"))).toBe(true);
	});

	it("moves focus to the toggle when the screen narrows under a focused menu link", async () => {
		await desktop();
		const header = mount(markup);
		await settle();
		shadowOf(menu(header)).querySelector(".nav-menu__link").focus();
		expect(document.activeElement).toBe(menu(header));
		await mobile();
		await expect.poll(() => menu(header).getAttribute("layout")).toBe("vertical");
		expect(root(header).activeElement).toBe(toggle(header));
	});

	it("leaves focus on the site name when the screen narrows", async () => {
		await desktop();
		const header = mount(markup);
		await settle();
		const name = root(header).querySelector(".site-header__name");
		name.focus();
		await mobile();
		await expect.poll(() => menu(header).getAttribute("layout")).toBe("vertical");
		expect(root(header).activeElement).toBe(name);
	});

	it("keeps focus in the header, ahead of the menu, when the screen widens under a focused toggle", async () => {
		await mobile();
		const header = mount(markup);
		await settle();
		toggle(header).focus();
		expect(root(header).activeElement).toBe(toggle(header));
		await desktop();
		await expect.poll(() => menu(header).getAttribute("layout")).toBe("horizontal");
		expect(document.activeElement).toBe(header);
		expect(root(header).activeElement).toBe(panel(header));
		await userEvent.tab();
		expect(document.activeElement).toBe(menu(header));
	});

	it("lays out a navigation menu added after the header connects", async () => {
		await mobile();
		const header = mount(`<ycl-site-header site-name="Late"></ycl-site-header>`);
		await settle();
		header.insertAdjacentHTML("beforeend", `<ycl-nav-menu><ycl-nav-menu-item label="A" href="/a"></ycl-nav-menu-item></ycl-nav-menu>`);
		await settle();
		expect(menu(header).getAttribute("layout")).toBe("vertical");
	});
});
