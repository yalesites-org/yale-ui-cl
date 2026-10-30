import { describe, expect, it } from "vitest";
import manifest from "../custom-elements.json";
import guide from "../AI-GUIDE.md?raw";

// Keeps custom-elements.json (and so the Storybook docs and AI-GUIDE.md) in step with the code, in
// both directions: every element, attribute, CSS attribute hook, slot and event the code uses must
// be declared, and every attribute, slot and event declared must be honoured by the code.
// `npm test` runs `npm run analyze` first, so a stale committed manifest shows up as a git diff.

const sources = import.meta.glob(["./01-atoms/**/*.js", "./02-molecules/**/*.js", "!**/*.stories.js", "!**/*.test.js"], {
	query: "?raw",
	import: "default",
	eager: true,
});
const stylesheets = import.meta.glob(["./01-atoms/**/*.css", "./02-molecules/**/*.css"], { query: "?raw", import: "default", eager: true });
// Importing the modules registers every element, so observed attributes are read from the live
// classes (SocialLinks computes its list). Vite only takes literal globs, hence the repetition.
import.meta.glob(["./01-atoms/**/*.js", "./02-molecules/**/*.js", "!**/*.stories.js", "!**/*.test.js"], { eager: true });

const declarations = new Map(
	manifest.modules.flatMap((mod) => mod.declarations ?? []).filter((d) => d.customElement && d.tagName).map((d) => [d.tagName, d]),
);

const unique = (values) => [...new Set(values)];
const quotedStrings = (text) => [...text.matchAll(/["']([\w-]+)["']/g)].map((m) => m[1]);
// The string literals of a union type such as "one"|"two", or [] for any other type.
const literalValues = (attribute) => [...(attribute?.type?.text ?? "").matchAll(/"([^"]*)"/g)].map((m) => m[1]);

// <template> contents (and other HTML assigned from a template literal) by variable name: name.innerHTML = `...`
const templatesIn = (source) =>
	new Map([...source.matchAll(/(\w+)\.innerHTML\s*=\s*`([\s\S]*?)`/g)].map((m) => [m[1], m[2]]));

// Stylesheets the module imports: `import name from "./x.css?inline"`, by imported name, as keys of
// `stylesheets` (paths relative to this file).
function stylesheetsIn(file, source) {
	return new Map([...source.matchAll(/import\s+(\w+)\s+from\s+["']([^"']+\.css)(?:\?[\w&=]*)?["']/g)].map((m) => {
		const path = new URL(m[2], new URL(file, "file:///src/")).pathname.replace(/^\/src\//, "./");
		return [m[1], path];
	}));
}

// Attribute selectors inside :host(...), with :not(...) and other nesting: `:host([theme="two"])`
// gives { name: "theme", value: "two" }, `:host([featured])` gives { name: "featured" }.
function hostAttributes(css) {
	const text = css.replace(/\/\*[\s\S]*?\*\//g, "");
	const found = [];
	for (const host of text.matchAll(/:host\(/g)) {
		let depth = 0;
		let end = host.index + host[0].length - 1;
		for (; end < text.length; end++) {
			if (text[end] === "(") depth++;
			else if (text[end] === ")" && --depth === 0) break;
		}
		const inner = text.slice(host.index + host[0].length, end);
		for (const m of inner.matchAll(/\[\s*([\w-]+)\s*(?:([~|^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([\w-]+))\s*[is]?\s*)?\]/g)) {
			// Only an exact match (=) names a whole value; ^=, *= and the rest name part of one.
			found.push({ name: m[1], value: m[2] === "=" ? (m[3] ?? m[4] ?? m[5]) : undefined });
		}
	}
	return found;
}

// Values a template-literal slot name like `links-${column}` can take: the strings in the array the
// variable is iterated from (`columns.forEach((column) =>` with `const columns = [...]`, or
// `[["one", a], ["two", b]].forEach(([column, nodes]) =>`).
function loopValues(source, variable) {
	const loop = source.match(new RegExp(`^\\s*(\\w+|\\[.*\\])\\.forEach\\(\\(\\[?${variable}\\b`, "m"));
	if (!loop) return [];
	const list = /^\w+$/.test(loop[1]) ? source.match(new RegExp(`const ${loop[1]}\\s*=\\s*\\[([^\\]]*)\\]`))?.[1] ?? "" : loop[0];
	return quotedStrings(list);
}

// With manual slot assignment (Tabs, LinkGroup, LinkGrid, QuickLinks) the component picks children
// by their slot attribute itself, so the names authors use are in the code, not in <slot> elements.
function manualSlotNames(body) {
	const literal = [
		...[...body.matchAll(/bySlot\(["']([\w-]+)["']\)/g)].map((m) => m[1]),
		...[...body.matchAll(/\.slot\s*===\s*["']([\w-]+)["']/g)].map((m) => m[1]),
		...[...body.matchAll(/const named\s*=\s*\[([^\]]*)\]/g)].flatMap((m) => quotedStrings(m[1])),
	];
	const templated = [...body.matchAll(/bySlot\(`([\w-]*)\$\{(\w+)\}([\w-]*)`\)/g)].flatMap(([, before, variable, after]) =>
		loopValues(body, variable).map((value) => `${before}${value}${after}`),
	);
	return unique([...literal, ...templated]);
}

// Each class body (up to the next class) plus the templates and stylesheets it references, so files
// that define two elements check each element against its own template and styles.
function elementsIn(file, source) {
	const tags = new Map([...source.matchAll(/customElements\.define\(["']([\w-]+)["'],\s*(\w+)\)/g)].map((m) => [m[2], m[1]]));
	const templates = templatesIn(source);
	const sheets = stylesheetsIn(file, source);
	const classes = [...source.matchAll(/class (\w+) extends HTMLElement/g)];
	return classes
		.filter((m) => tags.has(m[1]))
		.map((m, i, all) => {
			const tag = tags.get(m[1]);
			// Helpers defined before the first class (templates, constants) belong to the whole file.
			const preamble = source.slice(0, classes[0].index);
			const body = source.slice(m.index, all[i + 1]?.index ?? source.length);
			const references = (name) => new RegExp(`\\b${name}\\b`).test(body);
			const html = [...templates].filter(([name]) => references(name)).map(([, t]) => t).join("\n");
			const markup = `${body}\n${html}`;
			const manualSlots = /slotAssignment:\s*["']manual["']/.test(body);
			// Without a shadow root the element's children simply render in place: a default slot.
			const shadowless = !/attachShadow\(/.test(body);
			const slotElements = shadowless ? [""] : [...markup.matchAll(/<slot\b([^>]*)>/g)].map((s) => s[1].match(/\bname=["']([\w-]+)["']/)?.[1] ?? "");
			return {
				file,
				tag,
				sheets: [...sheets].filter(([name]) => references(name)).map(([, path]) => path),
				observed: [...(customElements.get(tag)?.observedAttributes ?? [])],
				read: unique([
					...[...body.matchAll(/(?:get|has|toggle)Attribute\(\s*["'`]([\w-]+)["'`]/g)].map((a) => a[1]),
					...[...body.matchAll(/\bname\s*===\s*["']([\w-]+)["']/g)].map((a) => a[1]),
				]),
				manualSlots,
				slots: manualSlots ? manualSlotNames(`${preamble}\n${body}`) : unique(slotElements),
				events: unique([...body.matchAll(/new (?:Custom)?Event\(["']([\w:-]+)["']/g)].map((e) => e[1])),
				// A native <input>/<select>/<textarea> in the shadow root fires a composed `input` event
				// that reaches the host, so form controls must document it.
				nativeInput: /static formAssociated\s*=\s*true/.test(body) && /<(input|select|textarea)\b/.test(html),
			};
		});
}

const elements = Object.entries(sources).flatMap(([file, source]) => elementsIn(file, source));
const defineCalls = Object.values(sources).reduce((count, source) => count + (source.match(/customElements\.define\(/g)?.length ?? 0), 0);

// Elements sharing a stylesheet (ycl-callout and ycl-callout-item both adopt callout.css). A :host()
// rule in it can only be checked against the union of their attributes: CSS can't say which host
// it is meant for, and a rule that matches none of them is the drift this test catches.
const elementsBySheet = new Map();
for (const element of elements) {
	for (const sheet of element.sheets) elementsBySheet.set(sheet, [...(elementsBySheet.get(sheet) ?? []), element]);
}

const declaredAttributes = (tag) => declarations.get(tag)?.attributes ?? [];

// Global HTML attributes a component's CSS may style without declaring them (`:host([hidden])`).
const globalHostAttributes = new Set(["hidden", "slot", "id", "class", "style", "lang", "dir", "role"]);

// Declared attributes (`tag[name]`) and slots (`tag slot:name`) that nothing in the element's own
// code, CSS or <slot> elements handles, each with the reason it is still honoured. Keep this tiny:
// an entry here should be the exception, not a way to skip drift.
const honouredElsewhere = new Map([
	["select-input slot:", "<option> and <optgroup> children are moved into the shadow <select> (syncOptions), not slotted."],
]);

describe("custom-elements.json", () => {
	it("finds every component source", () => {
		expect(elements.length).toBe(defineCalls);
		expect(elements.length).toBe(declarations.size);
	});

	// One check per stylesheet, against every element that adopts it (see elementsBySheet).
	it.each([...elementsBySheet.keys()])("%s only styles declared attributes and values", (sheet) => {
		const hosts = elementsBySheet.get(sheet).map((element) => element.tag);
		const attributes = hosts.flatMap(declaredAttributes);
		for (const { name, value } of hostAttributes(stylesheets[sheet] ?? "")) {
			if (globalHostAttributes.has(name) || name.startsWith("aria-")) continue;
			const matches = attributes.filter((a) => a.name === name);
			expect(matches.length, `:host([${name}]) is not an attribute of ${hosts.join(" or ")}`).toBeGreaterThan(0);
			if (value === undefined) continue;
			const unions = matches.map(literalValues);
			// A plain string type accepts any value; otherwise the value must be in one of the unions.
			if (unions.some((values) => values.length === 0)) continue;
			expect(unions.flat(), `:host([${name}="${value}"]) on ${hosts.join(" or ")}`).toContain(value);
		}
	});

	describe.each(elements)("$tag ($file)", ({ tag, sheets, observed, read, manualSlots, slots, events, nativeInput }) => {
		const declaration = () => declarations.get(tag);
		const declared = () => declaredAttributes(tag).map((a) => a.name);
		const cssHooks = () => sheets.flatMap((sheet) => hostAttributes(stylesheets[sheet] ?? ""));

		it("is declared as a custom element", () => {
			expect(declaration(), `${tag} missing from the manifest`).toBeDefined();
		});

		it("imports stylesheets that exist", () => {
			for (const sheet of sheets) expect(stylesheets[sheet], sheet).toBeTypeOf("string");
		});

		it("declares every observed attribute", () => {
			expect(declared()).toEqual(expect.arrayContaining(observed));
		});

		it("honours every declared attribute", () => {
			const hooks = new Set(cssHooks().map((hook) => hook.name));
			for (const name of declared()) {
				const honoured = observed.includes(name) || read.includes(name) || hooks.has(name) || honouredElsewhere.has(`${tag}[${name}]`);
				expect(honoured, `${tag}[${name}] is declared, but nothing observes, reads or styles it`).toBe(true);
			}
		});

		// `class` descriptions like "Space-separated style variants: filled or outline, small." name
		// variants the component turns into `--variant` modifier classes, so each needs a CSS rule.
		it("styles every class variant it declares", () => {
			const description = declaredAttributes(tag).find((a) => a.name === "class")?.description ?? "";
			const list = description.match(/style variants:(.*)/i)?.[1] ?? "";
			const variants = list.replace(/\([^)]*\)/g, "").split(/,|\bor\b/).map((v) => v.trim().replace(/\.$/, "")).filter(Boolean);
			const css = sheets.map((sheet) => stylesheets[sheet]).join("\n");
			for (const variant of variants) expect(css, `${tag} class="${variant}"`).toMatch(new RegExp(`--${variant}(?![\\w-])`));
		});

		it("declares every slot, and only those", () => {
			const declaredSlots = (declaration()?.slots ?? []).map((s) => s.name);
			if (manualSlots) {
				// Manually assigned components take unslotted children by default; only named slots are in the code.
				expect(declaredSlots.filter(Boolean).sort()).toEqual(slots.filter(Boolean).sort());
			} else {
				const handled = declaredSlots.filter((name) => honouredElsewhere.has(`${tag} slot:${name}`));
				expect(declaredSlots.sort()).toEqual(unique([...slots, ...handled]).sort());
			}
		});

		it("declares every event it fires, and only those", () => {
			const declaredEvents = (declaration()?.events ?? []).map((e) => e.name);
			const fired = unique([...events, ...(nativeInput ? ["input"] : [])]);
			expect(declaredEvents.sort()).toEqual(fired.sort());
		});
	});
});

describe("AI-GUIDE.md", () => {
	it.each([...declarations.keys()])("mentions %s", (tag) => {
		expect(guide).toMatch(new RegExp(`(^|[^\\w-])${tag}(?![\\w-])`));
	});

	// Attributes any element may carry; everything else on a library element must be declared.
	const globalAttributes = new Set(["id", "slot", "style", "lang", "hidden", "role"]);
	const examples = [...guide.matchAll(/```html\n([\s\S]*?)```/g)].map((m) => m[1]);

	it("has HTML examples", () => {
		expect(examples.length).toBeGreaterThan(0);
	});

	it.each(examples)("example only uses declared attributes, values and slots:\n%s", (html) => {
		const template = document.createElement("template");
		template.innerHTML = html;
		for (const element of template.content.querySelectorAll("*")) {
			const declaration = declarations.get(element.localName);
			if (declaration) {
				for (const { name, value } of element.attributes) {
					if (globalAttributes.has(name) || name.startsWith("aria-")) continue;
					const attribute = (declaration.attributes ?? []).find((a) => a.name === name);
					expect(attribute, `${element.localName}[${name}]`).toBeDefined();
					const allowed = literalValues(attribute);
					if (allowed.length && name !== "class") expect(allowed, `${element.localName}[${name}]`).toContain(value);
				}
			}
			const parent = declarations.get(element.parentElement?.localName);
			if (parent && element.hasAttribute("slot")) {
				expect((parent.slots ?? []).map((s) => s.name), `${parent.tagName} slot`).toContain(element.slot);
			}
		}
	});
});
