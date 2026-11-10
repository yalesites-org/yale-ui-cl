import { describe, expect, it, vi } from "vitest";
import "./NavMenu.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const nav = (menu) => shadowOf(menu).querySelector("nav");
const toggles = (menu) => [...shadowOf(menu).querySelectorAll(".nav-menu__toggle")];
const submenu = (menu, toggle) => shadowOf(menu).getElementById(toggle.getAttribute("aria-controls"));
const expanded = (menu) => toggles(menu).map((t) => t.getAttribute("aria-expanded"));
const keydown = (target, key) => target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, composed: true }));
const pointerdown = (target) => target.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, composed: true }));
const active = (menu) => shadowOf(menu).activeElement;
const escape = (target, init = {}) => {
	const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true, cancelable: true, ...init });
	target.dispatchEvent(event);
	return event;
};

const markup = `
	<ycl-nav-menu>
		<ycl-nav-menu-item label="Home" href="/"></ycl-nav-menu-item>
		<ycl-nav-menu-item label="About">
			<ycl-nav-menu-item label="History" href="/about/history"></ycl-nav-menu-item>
			<ycl-nav-menu-item label="Leadership" href="/about/leadership" current></ycl-nav-menu-item>
		</ycl-nav-menu-item>
		<ycl-nav-menu-item label="Admissions">
			<ycl-nav-menu-item label="Apply" href="/apply"></ycl-nav-menu-item>
		</ycl-nav-menu-item>
		<ycl-nav-menu-item label="Contact" href="/contact"></ycl-nav-menu-item>
	</ycl-nav-menu>`;

describe("ycl-nav-menu", () => {
	it("renders a labelled nav landmark with a real list of links and toggles", () => {
		const menu = mount(markup);
		expect(nav(menu).getAttribute("aria-label")).toBe("Main");
		const list = nav(menu).querySelector(":scope > ul");
		const items = [...list.children];
		expect(items.map((li) => li.localName)).toEqual(["li", "li", "li", "li"]);
		expect(items[0].querySelector("a").getAttribute("href")).toBe("/");
		expect(items[0].textContent.trim()).toBe("Home");
		expect(toggles(menu).map((t) => t.textContent.trim())).toEqual(["About", "Admissions"]);
		expect(toggles(menu).every((t) => t.localName === "button" && t.type === "button")).toBe(true);
	});

	it("renders each dropdown as a hidden list of child links controlled by its toggle", () => {
		const menu = mount(markup);
		const [about] = toggles(menu);
		const list = submenu(menu, about);
		expect(list.localName).toBe("ul");
		expect(list.hidden).toBe(true);
		expect([...list.children].map((li) => li.localName)).toEqual(["li", "li"]);
		expect([...list.querySelectorAll("a")].map((a) => a.getAttribute("href"))).toEqual(["/about/history", "/about/leadership"]);
		expect(expanded(menu)).toEqual(["false", "false"]);
	});

	it("uses the label attribute as the nav's accessible name", async () => {
		const menu = mount(markup.replace("<ycl-nav-menu>", `<ycl-nav-menu label="Secondary">`));
		expect(nav(menu).getAttribute("aria-label")).toBe("Secondary");
		menu.setAttribute("label", "Section");
		await settle();
		expect(nav(menu).getAttribute("aria-label")).toBe("Section");
	});

	it("toggles a dropdown on click", () => {
		const menu = mount(markup);
		const [about] = toggles(menu);
		about.click();
		expect(about.getAttribute("aria-expanded")).toBe("true");
		expect(submenu(menu, about).hidden).toBe(false);
		about.click();
		expect(about.getAttribute("aria-expanded")).toBe("false");
		expect(submenu(menu, about).hidden).toBe(true);
	});

	it("keeps only one dropdown open at a time", () => {
		const menu = mount(markup);
		const [about, admissions] = toggles(menu);
		about.click();
		admissions.click();
		expect(expanded(menu)).toEqual(["false", "true"]);
		expect(submenu(menu, about).hidden).toBe(true);
	});

	it("closes the open dropdown on Escape and returns focus to its toggle", () => {
		const menu = mount(markup);
		const [about] = toggles(menu);
		about.click();
		const link = submenu(menu, about).querySelector("a");
		link.focus();
		keydown(link, "Escape");
		expect(about.getAttribute("aria-expanded")).toBe("false");
		expect(shadowOf(menu).activeElement).toBe(about);
	});

	it("closes when focus leaves the menu in the horizontal layout", () => {
		const menu = mount(markup);
		const outside = document.createElement("button");
		document.body.append(outside);
		const [about] = toggles(menu);
		about.focus();
		about.click();
		outside.focus();
		expect(about.getAttribute("aria-expanded")).toBe("false");
	});

	it("stays open on outside presses and focus loss in the vertical layout", () => {
		const menu = mount(markup.replace("<ycl-nav-menu>", `<ycl-nav-menu layout="vertical">`));
		const outside = document.createElement("button");
		document.body.append(outside);
		const [about] = toggles(menu);
		about.focus();
		about.click();
		pointerdown(document.body);
		outside.focus();
		expect(about.getAttribute("aria-expanded")).toBe("true");
	});

	it("reflects the layout attribute, defaulting to horizontal", async () => {
		const menu = mount(markup);
		expect(menu.layout).toBe("horizontal");
		expect(nav(menu).dataset.layout).toBe("horizontal");
		menu.layout = "vertical";
		expect(menu.getAttribute("layout")).toBe("vertical");
		expect(nav(menu).dataset.layout).toBe("vertical");
		menu.setAttribute("layout", "sideways");
		expect(menu.layout).toBe("horizontal");
		expect(nav(menu).dataset.layout).toBe("horizontal");
	});

	it("marks the current page with aria-current and flags its parent toggle", () => {
		const menu = mount(markup);
		const current = [...shadowOf(menu).querySelectorAll('[aria-current="page"]')];
		expect(current.map((a) => a.getAttribute("href"))).toEqual(["/about/leadership"]);
		const [about, admissions] = toggles(menu);
		expect(about.classList.contains("is-current")).toBe(true);
		expect(admissions.classList.contains("is-current")).toBe(false);
	});

	it("marks a current top-level link", () => {
		const menu = mount(markup.replace(`href="/contact"`, `href="/contact" current`).replace(" current></ycl-nav-menu-item>", "></ycl-nav-menu-item>"));
		const current = [...shadowOf(menu).querySelectorAll('[aria-current="page"]')];
		expect(current.map((a) => a.getAttribute("href"))).toEqual(["/contact"]);
		expect(toggles(menu).some((t) => t.classList.contains("is-current"))).toBe(false);
	});

	it("rebuilds when items change", async () => {
		const menu = mount(markup);
		const item = document.createElement("ycl-nav-menu-item");
		item.label = "News";
		item.href = "/news";
		menu.append(item);
		menu.children[0].current = true;
		await settle();
		const links = [...shadowOf(menu).querySelectorAll(".nav-menu__list > li > a")];
		expect(links.map((a) => a.textContent.trim())).toEqual(["Home", "Contact", "News"]);
		expect(links[0].getAttribute("aria-current")).toBe("page");
	});
	it("styles child links as navigation: no underline, menu text colour, inside the dropdown box", () => {
		const menu = mount(markup);
		const [about] = toggles(menu);
		about.click();
		const box = submenu(menu, about);
		const [history, leadership] = [...box.querySelectorAll(".nav-menu__sublink")];
		const homeLink = shadowOf(menu).querySelector(".nav-menu__link");
		expect(getComputedStyle(history).backgroundImage).toBe("none");
		expect(getComputedStyle(history).color).toBe(getComputedStyle(homeLink).color);
		expect(getComputedStyle(leadership).color).not.toBe(getComputedStyle(history).color);
		const outer = box.getBoundingClientRect();
		const inner = history.getBoundingClientRect();
		expect(inner.left).toBeGreaterThanOrEqual(outer.left);
		expect(inner.right).toBeLessThanOrEqual(outer.right);
	});
	it("draws the child link focus ring inside the dropdown box", async () => {
		const menu = mount(markup);
		const [about] = toggles(menu);
		about.click();
		const history = submenu(menu, about).querySelector(".nav-menu__sublink");
		history.focus({ focusVisible: true });
		await settle();
		expect(history.matches(":focus-visible")).toBe(true);
		const style = getComputedStyle(history);
		expect(parseFloat(style.outlineOffset)).toBeLessThanOrEqual(-parseFloat(style.outlineWidth));
	});
	it("closes the open dropdown on Escape without moving focus when focus is elsewhere in the menu", () => {
		const menu = mount(markup);
		const [about] = toggles(menu);
		about.click();
		const contact = shadowOf(menu).querySelectorAll(".nav-menu__link")[1];
		contact.focus();
		keydown(contact, "Escape");
		expect(about.getAttribute("aria-expanded")).toBe("false");
		expect(active(menu)).toBe(contact);
	});

	it("closes a pointer-opened dropdown on Escape even when focus is on the page body", () => {
		const menu = mount(markup);
		const [about] = toggles(menu);
		about.click();
		keydown(document.body, "Escape");
		expect(about.getAttribute("aria-expanded")).toBe("false");
	});

	it("claims Escape (preventDefault) only when focus is on the open toggle or in its dropdown", () => {
		const menu = mount(markup);
		const [about] = toggles(menu);
		about.click();
		const link = submenu(menu, about).querySelector("a");
		link.focus();
		expect(escape(link).defaultPrevented).toBe(true);
		about.click();
		about.blur();
		expect(escape(document.body).defaultPrevented).toBe(false);
		expect(about.getAttribute("aria-expanded")).toBe("false");
	});

	it("ignores Escape when focus is outside the menu on something other than the body", () => {
		const menu = mount(markup.replace("<ycl-nav-menu>", `<ycl-nav-menu layout="vertical">`));
		const input = document.createElement("input");
		document.body.append(input);
		try {
			const [about] = toggles(menu);
			about.click();
			input.focus();
			const event = escape(input);
			expect(event.defaultPrevented).toBe(false);
			expect(about.getAttribute("aria-expanded")).toBe("true");
			expect(submenu(menu, about).hidden).toBe(false);
			expect(document.activeElement).toBe(input);
		} finally {
			input.remove();
		}
	});

	it("leaves Escape alone when another handler already prevented it", () => {
		const menu = mount(markup);
		const [about] = toggles(menu);
		about.click();
		const link = submenu(menu, about).querySelector("a");
		link.focus();
		const event = new KeyboardEvent("keydown", { key: "Escape", bubbles: true, composed: true, cancelable: true });
		event.preventDefault();
		link.dispatchEvent(event);
		expect(about.getAttribute("aria-expanded")).toBe("true");
		expect(active(menu)).toBe(link);
	});

	it("closes on a pointer press outside in the horizontal layout", () => {
		const menu = mount(markup);
		const [about] = toggles(menu);
		about.click();
		pointerdown(document.body);
		expect(about.getAttribute("aria-expanded")).toBe("false");
	});

	it("listens on the document only while a dropdown is open, and stops when removed", () => {
		const add = vi.spyOn(document, "addEventListener");
		const remove = vi.spyOn(document, "removeEventListener");
		try {
			const menu = mount(markup);
			expect(add).not.toHaveBeenCalled();
			toggles(menu)[0].click();
			const added = add.mock.calls.map(([type, fn]) => [type, fn]);
			expect(added.map(([type]) => type).sort()).toEqual(["keydown", "pointerdown"]);
			menu.remove();
			const removed = remove.mock.calls.map(([type, fn]) => [type, fn]);
			for (const call of added) expect(removed).toContainEqual(call);
		} finally {
			add.mockRestore();
			remove.mockRestore();
		}
	});

	it("keeps focus on the same link when the menu rebuilds", async () => {
		const menu = mount(markup);
		const home = shadowOf(menu).querySelector(".nav-menu__link");
		home.focus();
		menu.children[0].current = true;
		await settle();
		const rebuilt = shadowOf(menu).querySelector(".nav-menu__link");
		expect(rebuilt.getAttribute("aria-current")).toBe("page");
		expect(active(menu)).toBe(rebuilt);
	});

	it("keeps focus on the same child link and toggle when the menu rebuilds", async () => {
		const menu = mount(markup);
		toggles(menu)[0].click();
		submenu(menu, toggles(menu)[0]).querySelectorAll("a")[1].focus();
		menu.querySelector('[label="History"]').current = true;
		await settle();
		const [about] = toggles(menu);
		expect(about.getAttribute("aria-expanded")).toBe("true");
		expect(active(menu)).toBe(submenu(menu, about).querySelectorAll("a")[1]);
		about.focus();
		menu.querySelector('[label="Apply"]').current = true;
		await settle();
		expect(active(menu)).toBe(toggles(menu)[0]);
	});

	it("keeps the same dropdown open when items are added or removed before it", async () => {
		const menu = mount(markup);
		const [, admissions] = toggles(menu);
		admissions.click();
		const item = document.createElement("ycl-nav-menu-item");
		item.label = "Research";
		item.append(Object.assign(document.createElement("ycl-nav-menu-item"), { label: "Labs" }));
		menu.prepend(item);
		await settle();
		expect(toggles(menu).map((t) => t.textContent.trim())).toEqual(["Research", "About", "Admissions"]);
		expect(expanded(menu)).toEqual(["false", "false", "true"]);
		menu.querySelector('ycl-nav-menu > [label="About"]').remove();
		item.remove();
		await settle();
		expect(toggles(menu).map((t) => t.textContent.trim())).toEqual(["Admissions"]);
		expect(expanded(menu)).toEqual(["true"]);
	});

	it("keeps focus on the same link when an item is inserted before it", async () => {
		const menu = mount(markup);
		shadowOf(menu).querySelector(".nav-menu__link").focus();
		menu.prepend(Object.assign(document.createElement("ycl-nav-menu-item"), { label: "News", href: "/news" }));
		await settle();
		expect(active(menu)?.textContent).toBe("Home");
	});

	it("keeps the same dropdown open and focus on the same child link when an item is inserted before it", async () => {
		const menu = mount(markup);
		toggles(menu)[0].click();
		submenu(menu, toggles(menu)[0]).querySelector("a").focus();
		const item = document.createElement("ycl-nav-menu-item");
		item.label = "Research";
		item.append(Object.assign(document.createElement("ycl-nav-menu-item"), { label: "Labs", href: "/labs" }));
		menu.prepend(item);
		await settle();
		expect(toggles(menu).map((t) => t.textContent.trim())).toEqual(["Research", "About", "Admissions"]);
		expect(expanded(menu)).toEqual(["false", "true", "false"]);
		expect(active(menu)?.textContent).toBe("History");
	});

	it("doesn't move focus to another item when the focused item is removed", async () => {
		const menu = mount(markup);
		toggles(menu)[0].focus();
		menu.querySelector('[label="About"]').remove();
		await settle();
		expect(toggles(menu).map((t) => t.textContent.trim())).toEqual(["Admissions"]);
		expect(active(menu)).toBeNull();
	});

	it("renders an item without an href as a non-link, keeping its label", () => {
		const menu = mount(markup.replace(`<ycl-nav-menu-item label="Contact" href="/contact">`, `<ycl-nav-menu-item label="Contact">`));
		const contact = shadowOf(menu).querySelectorAll(".nav-menu__link")[1];
		expect(contact.textContent).toBe("Contact");
		expect(contact.hasAttribute("href")).toBe(false);
		contact.focus();
		expect(active(menu)).not.toBe(contact);
	});
});
