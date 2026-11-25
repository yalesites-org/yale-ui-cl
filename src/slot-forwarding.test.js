import { describe, expect, it } from "vitest";
import { mount, settle, shadowOf } from "../test/helpers.js";
import "./main.js";

// A page component that wraps one of ours and forwards its own slots into it ("default" forwards
// the unnamed slot). When the page leaves those slots empty, the wrapped component is assigned
// only the forwarding <slot>s, which hold nothing, so it must treat them as empty.
if (!customElements.get("test-slot-forwarder")) customElements.define("test-slot-forwarder", class extends HTMLElement {
	connectedCallback() {
		const { tag, slots } = this.dataset;
		const forwards = slots.split(" ")
			.map((name) => (name === "default" ? "<slot></slot>" : `<slot name="${name}" slot="${name}"></slot>`))
			.join("");
		this.attachShadow({ mode: "open" }).innerHTML = `<${tag}>${forwards}</${tag}>`;
	}
});

describe("components treat an empty forwarded slot as empty", () => {
	it.each([
		// tag, forwarded slots, element whose hidden state shows it, expected hidden
		["ycl-image", "caption", ".caption", true],
		["ycl-image-block", "caption", ".caption", true],
		["ycl-image-banner", "caption", ".image-banner__caption", true],
		["ycl-video", "heading text", ".video__content", true],
		["ycl-action-banner", "actions", ".cta-banner__button-group", true],
		["ycl-page-title", "meta social-links", ".basic-meta", true],
		["ycl-search-result", "breadcrumbs highlighted teaser", ".search-result__teaser", true],
		["ycl-taxonomy-display-item", "default", ".taxonomy-display__item__none", false],
	])("%s", async (tag, slots, selector, hidden) => {
		const host = mount(`<test-slot-forwarder data-tag="${tag}" data-slots="${slots}"></test-slot-forwarder>`);
		await settle();
		expect(shadowOf(host.shadowRoot.querySelector(tag)).querySelector(selector).hidden).toBe(hidden);
	});
});
