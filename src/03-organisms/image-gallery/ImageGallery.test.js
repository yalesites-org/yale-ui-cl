import { describe, expect, it } from "vitest";
import { ImageGallery } from "./ImageGallery.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const items = (gallery) => [...shadowOf(gallery).querySelectorAll(".gallery__item")];
const triggers = (gallery) => [...shadowOf(gallery).querySelectorAll(".gallery__trigger")];
const modal = (gallery) => shadowOf(gallery).querySelector("dialog.viewer");
const viewerImage = (gallery) => shadowOf(gallery).querySelector(".viewer__stage img");
const pager = (gallery) => shadowOf(gallery).querySelector(".viewer__pager").textContent.trim();
const caption = (gallery) => shadowOf(gallery).querySelector(".viewer__caption-text");
const toggle = (gallery) => shadowOf(gallery).querySelector(".viewer__caption-toggle");
const previous = (gallery) => shadowOf(gallery).querySelector(".viewer__previous");
const next = (gallery) => shadowOf(gallery).querySelector(".viewer__next");
const closed = (el) => new Promise((resolve) => el.addEventListener("close", resolve, { once: true }));
const key = (target, name) => target.dispatchEvent(new KeyboardEvent("keydown", { key: name, bubbles: true, composed: true }));

const pixel = "data:image/gif;base64,R0lGODlhAQABAAAAACw=";
const long = "A long caption. ".repeat(20);
const markup = (attrs = "", extra = "") => `
	<ycl-image-gallery label="Campus photos" ${attrs}>
		<ycl-image><img src="${pixel}" alt="Quad"></ycl-image>
		<ycl-image-block><ycl-image><img src="${pixel}" alt="Library"></ycl-image><span slot="caption">Sterling</span></ycl-image-block>
		<ycl-image><img src="${pixel}" alt="Gate"></ycl-image>${extra}
	</ycl-image-gallery>`;

describe("ycl-image-gallery", () => {
	it("lists each child in its own named list item", () => {
		const gallery = mount(markup());
		const list = shadowOf(gallery).querySelector("ul");
		expect(list.getAttribute("aria-label")).toBe("Campus photos");
		expect(items(gallery)).toHaveLength(3);
		expect(items(gallery).map((li) => li.querySelector("slot").assignedElements()[0])).toEqual([...gallery.children]);
	});

	it("has no buttons or viewer unless interactive", () => {
		const gallery = mount(markup());
		expect(triggers(gallery)).toHaveLength(0);
		expect(modal(gallery)).toBeNull();
	});

	it("rebuilds when children are added", async () => {
		const gallery = mount(markup());
		gallery.append(document.createElement("ycl-image"));
		await settle();
		expect(items(gallery)).toHaveLength(4);
	});

	it("has no columns setting: width alone sets the columns", () => {
		expect(ImageGallery.observedAttributes).not.toContain("columns");
		expect(ImageGallery.observedAttributes).toContain("narrow");
	});

	it("hides captions under the thumbnails", () => {
		const gallery = mount(markup());
		expect(getComputedStyle(gallery.children[1]).getPropertyValue("--image-block-caption-display").trim()).toBe("none");
	});

	describe("interactive", () => {
		it("wraps each item in a button that opens a viewer dialog", () => {
			const gallery = mount(markup("interactive"));
			expect(triggers(gallery)).toHaveLength(3);
			expect(triggers(gallery).every((b) => b.getAttribute("aria-haspopup") === "dialog")).toBe(true);
			expect(modal(gallery).open).toBe(false);
		});

		it("opens when the image itself is clicked, as a mouse does", () => {
			const gallery = mount(markup("interactive"));
			gallery.children[1].querySelector("img").dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true }));
			expect(modal(gallery).open).toBe(true);
			expect(pager(gallery)).toBe("2 / 3");
		});

		it("is a full-screen dark viewer", () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[0].click();
			const style = getComputedStyle(modal(gallery));
			expect(style.width).toBe(`${window.innerWidth}px`);
			expect(style.height).toBe(`${window.innerHeight}px`);
			expect(style.backgroundColor).not.toBe("rgb(255, 255, 255)");
			const [r, g, b] = style.backgroundColor.match(/\d+/g).map(Number);
			expect(r + g + b).toBeLessThan(150);
		});

		it("opens the clicked image in the viewer with its numbered pager and caption", () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[1].click();
			expect(viewerImage(gallery).alt).toBe("Library");
			expect(pager(gallery)).toBe("2 / 3");
			expect(caption(gallery).textContent).toBe("Sterling");
			expect(shadowOf(gallery).querySelectorAll(".viewer__stage [slot=caption]")).toHaveLength(0);
		});

		it("shows no caption area for an image without one", () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[0].click();
			expect(shadowOf(gallery).querySelector(".viewer__caption").hidden).toBe(true);
		});

		it("wraps around at both ends", () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[2].click();
			expect(next(gallery).hasAttribute("disabled")).toBe(false);
			next(gallery).click();
			expect(viewerImage(gallery).alt).toBe("Quad");
			expect(pager(gallery)).toBe("1 / 3");
			expect(previous(gallery).hasAttribute("disabled")).toBe(false);
			previous(gallery).click();
			expect(viewerImage(gallery).alt).toBe("Gate");
			expect(pager(gallery)).toBe("3 / 3");
		});

		it("steps with the arrow keys, wrapping", () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[2].click();
			key(modal(gallery), "ArrowRight");
			expect(viewerImage(gallery).alt).toBe("Quad");
			key(modal(gallery), "ArrowLeft");
			expect(viewerImage(gallery).alt).toBe("Gate");
		});

		it("steps with the arrow keys while the close button has focus", () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[0].click();
			key(shadowOf(gallery).querySelector(".viewer__close"), "ArrowRight");
			expect(viewerImage(gallery).alt).toBe("Library");
		});

		it("trims a long caption and expands it with a toggle", () => {
			const gallery = mount(markup("interactive").replace("Sterling", long));
			triggers(gallery)[1].click();
			expect(toggle(gallery).hidden).toBe(false);
			expect(toggle(gallery).getAttribute("aria-expanded")).toBe("false");
			expect(caption(gallery).classList.contains("is-expanded")).toBe(false);
			toggle(gallery).click();
			expect(toggle(gallery).getAttribute("aria-expanded")).toBe("true");
			expect(caption(gallery).classList.contains("is-expanded")).toBe(true);
		});

		it("offers no toggle for a short caption", () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[1].click();
			expect(toggle(gallery).hidden).toBe(true);
			expect(getComputedStyle(toggle(gallery)).display).toBe("none");
		});

		it("collapses the caption again on the next image", () => {
			const gallery = mount(markup("interactive").replace("Sterling", long));
			triggers(gallery)[1].click();
			toggle(gallery).click();
			next(gallery).click();
			previous(gallery).click();
			expect(toggle(gallery).getAttribute("aria-expanded")).toBe("false");
		});

		it("announces the position change politely", () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[0].click();
			expect(shadowOf(gallery).querySelector(".viewer__pager").getAttribute("aria-live")).toBe("polite");
		});

		it("returns focus to the image that was opened", async () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[2].focus();
			triggers(gallery)[2].click();
			const done = closed(modal(gallery));
			modal(gallery).close();
			await done;
			expect(shadowOf(gallery).activeElement).toBe(triggers(gallery)[2]);
		});

		it("clears the viewer image when closed so a hidden copy does not linger", async () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[0].click();
			const done = closed(modal(gallery));
			modal(gallery).close();
			await done;
			expect(viewerImage(gallery)).toBeNull();
		});
	});
});
