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

// Every element in a component's composed tree: the element itself, its light DOM, its shadow
// root, and the shadow roots of everything inside them.
export function composedElements(element) {
	const roots = Element.prototype.attachShadow.roots;
	const out = [element];
	const visit = (node) => {
		for (const el of node.querySelectorAll("*")) {
			out.push(el);
			const shadow = roots.get(el);
			if (shadow) visit(shadow);
		}
	};
	const shadow = roots.get(element);
	if (shadow) visit(shadow);
	visit(element);
	return out;
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

// YaleSites' responsive spacing, which src/styles/shadow.css gives every shadow root, as the
// computed px string a test sees at the current viewport. 768px is --break-m, 992px --break-l,
// 1200px --break-xl and 1400px --break-2xl.
export const rem = (n) => `${n * parseFloat(getComputedStyle(document.documentElement).fontSize)}px`;
export const atLeast = (px) => matchMedia(`(min-width: ${px}px)`).matches;
// --spacing-page-section.
export const pageSection = () => (atLeast(992) ? rem(4) : rem(2.5));
// --size-spacing-site-gutter.
export const gutter = () => rem(atLeast(1400) ? 4 : atLeast(1200) ? 2.5 : atLeast(992) ? 2 : atLeast(768) ? 1.5 : 1);
