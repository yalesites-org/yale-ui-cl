import { describe, expect, it, vi } from "vitest";
import "./Modal.js";
import { mount, shadowOf } from "../../../test/helpers.js";

const dialog = (modal) => shadowOf(modal).querySelector("dialog");
// <dialog> fires close in a later task, and the modal finishes closing from that handler.
const closed = (modal) => new Promise((resolve) => modal.addEventListener("close", resolve, { once: true }));

describe("ycl-modal", () => {
	it("opens from an authored open attribute once connected", () => {
		const modal = mount(`<ycl-modal open><span slot="heading">Title</span>Body</ycl-modal>`);
		expect(dialog(modal).open).toBe(true);
		expect(dialog(modal).matches(":modal")).toBe(true);
	});

	it("opens and closes, firing events and locking page scroll", async () => {
		const modal = mount(`<ycl-modal>Body</ycl-modal>`);
		const onOpen = vi.fn();
		const onClose = vi.fn();
		modal.addEventListener("open", onOpen);
		modal.addEventListener("close", onClose);

		modal.show();
		expect(dialog(modal).open).toBe(true);
		expect(document.body.style.overflow).toBe("hidden");
		expect(onOpen).toHaveBeenCalledOnce();

		modal.close();
		await closed(modal);
		expect(dialog(modal).open).toBe(false);
		expect(document.body.style.overflow).toBe("");
		expect(onClose).toHaveBeenCalledOnce();
	});

	it("closes from its close button and returns focus to the opener", async () => {
		const opener = mount(`<button>Open</button>`);
		const modal = mount(`<ycl-modal>Body</ycl-modal>`);
		opener.focus();
		modal.show();
		shadowOf(modal).querySelector(".modal__close").click();
		await closed(modal);
		expect(modal.open).toBe(false);
		expect(document.activeElement).toBe(opener);
	});

	it("drops the open attribute when the dialog closes itself", async () => {
		const modal = mount(`<ycl-modal open>Body</ycl-modal>`);
		// Stands in for Escape, which closes the dialog directly.
		dialog(modal).close();
		await closed(modal);
		expect(modal.open).toBe(false);
	});

	it("closes when the backdrop is clicked, but not the content", () => {
		const modal = mount(`<ycl-modal open>Body</ycl-modal>`);
		const container = shadowOf(modal).querySelector(".modal__container");
		container.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
		container.click();
		expect(modal.open).toBe(true);

		dialog(modal).dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
		dialog(modal).click();
		expect(modal.open).toBe(false);
	});
});
