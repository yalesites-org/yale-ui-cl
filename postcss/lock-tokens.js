import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
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

const TOKENS_FILE = createRequire(import.meta.url).resolve("@yalesites-org/tokens/build/css/tokens.css");

function readTokens() {
	const tokens = new Map();
	postcss.parse(readFileSync(TOKENS_FILE, "utf8")).walkDecls(/^--/, (decl) => {
		tokens.set(decl.prop, decl.value);
	});
	return tokens;
}

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
 */
export default function lockTokens() {
	const tokens = readTokens();
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

	function rewrite(value) {
		return replaceVars(value, (name, fallback) => {
			if (!tokens.has(name)) return `var(${name}${fallback ? `, ${rewrite(fallback)}` : ""})`;
			if (!THEMEABLE.has(name)) return resolve(name);
			return `var(${name}, ${fallback ? rewrite(fallback) : resolve(name)})`;
		});
	}

	return {
		postcssPlugin: "lock-tokens",
		Declaration(decl) {
			if (decl.source?.input.file === TOKENS_FILE || !decl.value.includes("var(")) return;
			decl.value = rewrite(decl.value);
		},
	};
}
lockTokens.postcss = true;
