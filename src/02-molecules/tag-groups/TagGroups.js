import { baseSheet, componentSheet } from "../../styles/shadow.js";
import componentStyles from "./tag-groups.css?inline";

const tagGroupsTemplate = document.createElement("template");
tagGroupsTemplate.innerHTML = `
	<div class="tag-groups">
		<div class="tag-groups__inner">
			<div class="tag-groups__content">
				<div class="tag-groups__list" role="list"><slot></slot></div>
			</div>
		</div>
	</div>
`;

// Each item lives in its own shadow root, so it can't be a real <li> of the parent's list; it takes
// the listitem role through ElementInternals instead. The terms are slotted links grouped under
// the label, which also names the group for screen readers.
const tagGroupTemplate = document.createElement("template");
tagGroupTemplate.innerHTML = `
	<div class="tag-groups__item">
		<span class="tag-groups__item__label" id="label"></span>
		<div class="tag-groups__item__list" role="group" aria-labelledby="label">
			<span class="tag-groups__item__none">None</span>
			<slot></slot>
		</div>
	</div>
`;

export class TagGroup extends HTMLElement {
	#shadow;
	#internals;
	static get observedAttributes() {
		return ["label"];
	}

	constructor() {
		super();
		this.#internals = this.attachInternals();
		this.#internals.role = "listitem";
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "tag-groups")];
		this.#shadow.appendChild(document.importNode(tagGroupTemplate.content, true));
		this.labelEl = this.#shadow.querySelector(".tag-groups__item__label");
		this.listEl = this.#shadow.querySelector(".tag-groups__item__list");

		// "None" shows until terms are slotted; slotchange never fires for a slot that stays empty.
		const slot = this.#shadow.querySelector("slot");
		const none = this.#shadow.querySelector(".tag-groups__item__none");
		slot.addEventListener("slotchange", () => {
			const empty = slot.assignedElements().length === 0;
			none.hidden = !empty;
			this.listEl.classList.toggle("tag-groups__item__list--empty", empty);
		});
		this.listEl.classList.add("tag-groups__item__list--empty");
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		if (name === "label") this.labelEl.textContent = newValue ?? "";
	}

	get label() { return this.getAttribute("label"); }
	set label(value) { this.setAttribute("label", value); }
}

export class TagGroups extends HTMLElement {
	#shadow;

	constructor() {
		super();
		this.#shadow = this.attachShadow({ mode: "closed" });
		this.#shadow.adoptedStyleSheets = [baseSheet, componentSheet(componentStyles, "tag-groups")];
		this.#shadow.appendChild(document.importNode(tagGroupsTemplate.content, true));
	}
}

if (!customElements.get("ycl-tag-groups")) customElements.define("ycl-tag-groups", TagGroups);
if (!customElements.get("ycl-tag-group")) customElements.define("ycl-tag-group", TagGroup);
