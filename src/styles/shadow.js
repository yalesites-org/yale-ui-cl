import shadowStyles from "./shadow.css?inline";

const sheets = new Map();

// One CSSStyleSheet per component stylesheet, shared by every instance (and by any other component
// that adopts it), so each is only parsed once. Wrapping in components.<name> keeps the same
// cascade layering as base.css.
export function componentSheet(css, name) {
	if (!sheets.has(name)) {
		const sheet = new CSSStyleSheet();
		sheet.replaceSync(`@layer components.${name} {\n${css}\n}`);
		sheets.set(name, sheet);
	}
	return sheets.get(name);
}

export const baseSheet = new CSSStyleSheet();
baseSheet.replaceSync(shadowStyles);
