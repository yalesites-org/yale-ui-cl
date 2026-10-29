// Components attach open shadow roots (see docs/decisions/open-shadow-roots.md). shadowOf() returns
// an element's root and fails loudly when it has none or the root is closed.
export function shadowOf(element) {
	if (!element.shadowRoot) throw new Error(`<${element.localName}> has no open shadow root`);
	return element.shadowRoot;
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
