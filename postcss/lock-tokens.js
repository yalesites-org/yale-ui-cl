import { globSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { isAbsolute, relative, resolve as resolvePath } from "node:path";
import postcss from "postcss";

// Tokens components redefine on themselves to theme their contents, and that pages may set to
// theme components. They stay custom properties, with the resolved token value as a fallback so
// components still render without the document stylesheet. Every other token is locked.
export const THEMEABLE = new Set([
	"--color-text",
	"--color-heading",
	"--color-background",
	"--color-link-base",
	"--color-link-hover",
	"--color-link-visited-base",
	"--color-link-visited-hover",
]);

// Names that look like tokens but aren't in @yalesites-org/tokens and that no component declares:
// the page sets them on purpose, and component CSS reads them with a fallback. Add a name here only
// when that's the intent. The --color-theme-* palette is documented under "Theme" in the README.
export const PAGE_PROVIDED = new Set([
	"--color-theme-primary",
	"--color-theme-secondary",
	"--color-theme-tertiary",
	"--color-theme-accent-1",
	"--color-theme-accent-2",
	"--color-social-links-hover", // the YaleSites site footer sets it on ycl-social-links
	"--color-divider", // documented as a @cssprop of ycl-divider
]);

const SRC = resolvePath(import.meta.dirname, "../src");

export const TOKENS_FILE = createRequire(import.meta.url).resolve("@yalesites-org/tokens/build/css/tokens.css");

// Custom property names declared in a parsed stylesheet.
function declaredIn(root, names = new Set()) {
	root.walkDecls(/^--/, (decl) => names.add(decl.prop));
	return names;
}

function readTokens() {
	const tokens = new Map();
	postcss.parse(readFileSync(TOKENS_FILE, "utf8")).walkDecls(/^--/, (decl) => {
		tokens.set(decl.prop, decl.value);
	});
	return tokens;
}

// Whether file (a path Vite may write with forward slashes and a ?query) is under src/.
function inSrc(file) {
	const rel = relative(SRC, file.split("?")[0]);
	return rel !== "" && !rel.startsWith("..") && !isAbsolute(rel);
}

// Custom property names declared by any component stylesheet under src/, so components may read each other's.
function readDeclared() {
	const names = new Set();
	for (const file of globSync("**/*.css", { cwd: SRC })) {
		declaredIn(postcss.parse(readFileSync(resolvePath(SRC, file), "utf8")), names);
	}
	return names;
}

// The first word of a custom property name: "color" for --color-blue-yale.
const prefix = (name) => name.slice(2).split("-")[0];

// Calls fn(name, fallback) for each top-level var() in value and splices in its return value.
// fallback is the raw text after the first comma, or undefined.
function replaceVars(value, fn) {
	let out = "";
	let i = 0;
	while (i < value.length) {
		const start = value.indexOf("var(", i);
		if (start === -1) break;
		out += value.slice(i, start);
		let depth = 1;
		let j = start + 4;
		let comma = -1;
		for (; j < value.length && depth; j++) {
			if (value[j] === "(") depth++;
			else if (value[j] === ")") depth--;
			else if (value[j] === "," && depth === 1 && comma === -1) comma = j;
		}
		const inner = value.slice(start + 4, j - 1);
		const name = (comma === -1 ? inner : value.slice(start + 4, comma)).trim();
		const fallback = comma === -1 ? undefined : value.slice(comma + 1, j - 1).trim();
		out += fn(name, fallback);
		i = j;
	}
	return out + value.slice(i);
}

/**
 * Replaces references to @yalesites-org/tokens custom properties in component CSS so pages can't
 * restyle components by redefining tokens: locked tokens become their literal value, themeable
 * tokens get the literal value as a var() fallback. The tokens file itself passes through
 * untouched, so the document stylesheet still defines the full token set.
 *
 * It also fails the build when CSS under src/ reads a name that looks like a token (it starts with
 * the same word as a token, like --color-) but isn't in the tokens file, and no component declares
 * it. A token renamed in a tokens release looks like that, and a var() fallback would hide it.
 */
export default function lockTokens() {
	const tokens = readTokens();
	const tokenPrefixes = new Set([...tokens.keys()].map(prefix));
	// Read on the first suspect name only: most runs never meet one, so they skip parsing every stylesheet.
	// Read again before failing, so a dev server sees a declaration added after it started.
	let declared;
	const resolved = new Map();

	function resolve(name, seen = new Set()) {
		if (resolved.has(name)) return resolved.get(name);
		if (seen.has(name)) throw new Error(`lock-tokens: circular token reference at ${name}`);
		seen.add(name);
		const value = replaceVars(tokens.get(name), (ref, fallback) =>
			tokens.has(ref) ? resolve(ref, seen) : `var(${ref}${fallback ? `, ${fallback}` : ""})`,
		);
		resolved.set(name, value);
		return value;
	}

	// check(name) is called with every var() name that isn't a token, fallbacks included.
	function rewrite(value, check) {
		return replaceVars(value, (name, fallback) => {
			if (!tokens.has(name)) {
				check(name);
				return `var(${name}${fallback ? `, ${rewrite(fallback, check)}` : ""})`;
			}
			if (!THEMEABLE.has(name)) return resolve(name);
			return `var(${name}, ${fallback ? rewrite(fallback, check) : resolve(name)})`;
		});
	}

	const suspect = (name) =>
		tokenPrefixes.has(prefix(name)) &&
		!PAGE_PROVIDED.has(name) &&
		!(declared ??= readDeclared()).has(name) &&
		!(declared = readDeclared()).has(name);

	return {
		postcssPlugin: "lock-tokens",
		prepare() {
			// Names this stylesheet declares, read from the stylesheet being built rather than from disk,
			// so a new or just-edited file counts too.
			let local;
			return {
				Declaration(decl) {
					// The declaration's own file, not the one being built: base.css @imports the tokens and
					// other packages' CSS, and Vite inlines them before this plugin runs.
					const file = decl.source?.input.file;
					if (file === TOKENS_FILE || !decl.value.includes("var(")) return;
					const checked = file !== undefined && inSrc(file);
					decl.value = rewrite(decl.value, (name) => {
						if (!checked || !suspect(name)) return;
						local ??= declaredIn(decl.root());
						if (local.has(name)) return;
						throw decl.error(
							`${decl.prop} reads ${name}, which looks like a @yalesites-org/tokens name but isn't in the tokens file, ` +
								"and no component declares it. If a tokens release renamed it, use the new name; " +
								"if the page sets it on purpose, add it to PAGE_PROVIDED in postcss/lock-tokens.js.",
							{ word: name },
						);
					});
				},
			};
		},
	};
}
lockTokens.postcss = true;
