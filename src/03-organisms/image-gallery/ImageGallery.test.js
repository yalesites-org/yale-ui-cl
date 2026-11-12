import { describe, expect, it } from "vitest";
import "./ImageGallery.js";
import { mount, settle, shadowOf } from "../../../test/helpers.js";

const items = (gallery) => [...shadowOf(gallery).querySelectorAll(".gallery__item")];
const triggers = (gallery) => [...shadowOf(gallery).querySelectorAll(".gallery__trigger")];
const modal = (gallery) => shadowOf(gallery).querySelector("ycl-modal");
const viewerImage = (gallery) => shadowOf(gallery).querySelector(".gallery__viewer img");
const heading = (gallery) => shadowOf(gallery).querySelector('[slot="heading"]').textContent;
const previous = (gallery) => shadowOf(gallery).querySelector(".gallery__previous");
const next = (gallery) => shadowOf(gallery).querySelector(".gallery__next");
const closed = (el) => new Promise((resolve) => el.addEventListener("close", resolve, { once: true }));

const markup = (attrs = "") => `
	<ycl-image-gallery label="Campus photos" ${attrs}>
		<ycl-image><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Quad"></ycl-image>
		<ycl-image-block><ycl-image><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Library"></ycl-image><span slot="caption">Sterling</span></ycl-image-block>
		<ycl-image><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Gate"></ycl-image>
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

	describe("interactive", () => {
		it("wraps each item in a button that opens a dialog", () => {
			const gallery = mount(markup("interactive"));
			expect(triggers(gallery)).toHaveLength(3);
			expect(triggers(gallery).every((b) => b.getAttribute("aria-haspopup") === "dialog")).toBe(true);
			expect(modal(gallery).open).toBe(false);
		});

		it("opens the clicked image in the viewer with its position", () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[1].click();
			expect(modal(gallery).open).toBe(true);
			expect(viewerImage(gallery).alt).toBe("Library");
			expect(heading(gallery)).toBe("Image 2 of 3");
			expect(shadowOf(gallery).querySelector(".gallery__viewer figcaption, .gallery__viewer [slot=caption]")?.textContent).toBe("Sterling");
		});

		it("steps with the previous and next buttons and stops at the ends", () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[0].click();
			expect(previous(gallery).hasAttribute("disabled")).toBe(true);
			next(gallery).click();
			expect(viewerImage(gallery).alt).toBe("Library");
			expect(heading(gallery)).toBe("Image 2 of 3");
			next(gallery).click();
			expect(viewerImage(gallery).alt).toBe("Gate");
			expect(next(gallery).hasAttribute("disabled")).toBe(true);
			next(gallery).click();
			expect(viewerImage(gallery).alt).toBe("Gate");
			previous(gallery).click();
			expect(viewerImage(gallery).alt).toBe("Library");
		});

		it("steps with the arrow keys", () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[1].click();
			shadowOf(modal(gallery)); // the viewer lives in the modal's slot, so keys reach the gallery's viewer
			shadowOf(gallery).querySelector(".gallery__viewer").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
			expect(viewerImage(gallery).alt).toBe("Gate");
			shadowOf(gallery).querySelector(".gallery__viewer").dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
			expect(viewerImage(gallery).alt).toBe("Library");
		});

		it("announces the position change politely", () => {
			const gallery = mount(markup("interactive"));
			triggers(gallery)[0].click();
			expect(shadowOf(gallery).querySelector('[aria-live="polite"]')).not.toBeNull();
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
