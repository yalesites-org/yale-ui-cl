import { describe, expect, it } from "vitest";
import pkg from "../package.json";
import tokensCss from "@yalesites-org/tokens/build/css/tokens.css?raw";

// The first capture group of every match of pattern in a source string.
const names = (pattern) => (source) => [...source.matchAll(pattern)].map((match) => match[1]);

// Custom property names declared in a stylesheet (`--name:`), ignoring var() references.
const declared = names(/(--[\w-]+)\s*:/g);

// Custom property names a script sets on an element (`style.setProperty("--name", …)`). Only
// setProperty counts: a property set in an inline style string isn't seen.
const setInScript = names(/setProperty\(\s*["'](--[\w-]+)["']/g);

// Custom property names read with no fallback (`var(--name)`). A read with a fallback isn't
// checked, so a renamed token read that way falls back silently.
const read = names(/var\(\s*(--[\w-]+)\s*\)/g);

const stripComments = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "");

const raw = import.meta.glob("./**/*.css", { query: "?raw", import: "default", eager: true });
const css = Object.fromEntries(Object.entries(raw).map(([file, source]) => [file, stripComments(source)]));
const js = import.meta.glob(["./01-atoms/**/*.js", "./02-molecules/**/*.js", "./03-organisms/**/*.js", "!**/*.stories.js", "!**/*.test.js"], {
	query: "?raw",
	import: "default",
	eager: true,
});
const reads = Object.entries(css).flatMap(([file, source]) => read(source).map((name) => ({ file, name })));
// One set for the whole repo: a property declared by one component counts for every component,
// so this catches names nothing defines, not a component reading another component's property.
const defined = new Set([
	...declared(stripComments(tokensCss)),
	...Object.values(css).flatMap(declared),
	...Object.values(js).flatMap(setInScript),
]);

// Known undefined properties, each with the issue that fixes it. Remove an entry once it's fixed.
const KNOWN_GAPS = new Set([
	"--cta-radius-soft", // yalesites-org/yale-ui-cl#128
]);

describe("@yalesites-org/tokens", () => {
	// Keep the tilde: tokens shipped a breaking rename in a patch release (1.40.2), so the pin only
	// takes patches within one minor. See "Tokens version" in the README.
	it("is pinned with a tilde range", () => {
		expect(pkg.devDependencies["@yalesites-org/tokens"]).toMatch(/^~\d+\.\d+\.\d+$/);
	});

	// A token that a release renames or drops would otherwise fail silently: lock-tokens leaves an
	// unknown var() alone and the browser drops the declaration.
	it("defines every custom property the component CSS reads without a fallback", () => {
		const missing = reads.filter(({ name }) => !defined.has(name) && !KNOWN_GAPS.has(name)).map(({ file, name }) => `${file}: ${name}`);
		expect(missing).toEqual([]);
	});

	// Fails once a gap is fixed or no longer read, so its exemption can't outlive the bug and hide a new one.
	it("lists only known gaps that are still read and still undefined", () => {
		const stale = [...KNOWN_GAPS].filter((name) => defined.has(name) || !reads.some((entry) => entry.name === name));
		expect(stale).toEqual([]);
	});
});
