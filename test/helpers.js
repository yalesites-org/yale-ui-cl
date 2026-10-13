// Components attach closed shadow roots, which tests can't reach through element.shadowRoot.
// Record every root as it's attached so shadowOf() can hand it back. This has to run before any
// component is constructed, so test/setup.js imports it. The registry hangs off the patched
// method so it's shared even if this module is ever evaluated twice.
if (!Element.prototype.attachShadow.roots) {
	const attachShadow = Element.prototype.attachShadow;
	const roots = new WeakMap();
	Element.prototype.attachShadow = function (init) {
		const root = attachShadow.call(this, init);
		roots.set(this, root);
		return root;
	};
	Element.prototype.attachShadow.roots = roots;
}

export function shadowOf(element) {
	const root = Element.prototype.attachShadow.roots.get(element);
	if (!root) throw new Error(`<${element.localName}> has no shadow root`);
	return root;
}

// Parses markup into the document and returns the first element. The body is cleared after each test.
export function mount(html) {
	const template = document.createElement("template");
	template.innerHTML = html.trim();
	const element = template.content.firstElementChild;
	document.body.append(template.content);
	return element;
}

// slotchange and MutationObserver callbacks run as microtasks after the change that caused them.
export const settle = () => new Promise((resolve) => setTimeout(resolve));
