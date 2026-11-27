import { resolve } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";
import lockTokens, { TOKENS_FILE } from "./lock-tokens.js";

// A component stylesheet that doesn't exist on disk, so nothing in src/ declares what it declares.
const FILE = resolve(import.meta.dirname, "../src/01-atoms/fixture/fixture.css");

// CSS from a package, which the check skips.
const OUTSIDE = resolve(import.meta.dirname, "../node_modules/some-package/style.css");

const BASE = resolve(import.meta.dirname, "../src/styles/base.css");

const run = (css, from = FILE) => postcss([lockTokens()]).process(css, { from }).css;

// Builds css from `from` as if src/styles/base.css had @imported it, the way Vite inlines @import:
// the declarations keep their own source file, but the file being built is base.css.
const runImported = (css, from) => {
	const root = postcss.parse("", { from: BASE });
	root.append(postcss.parse(css, { from }).nodes);
	return postcss([lockTokens()]).process(root, { from: BASE }).css;
};

describe("lock-tokens", () => {
	it("locks a token to its literal value", () => {
		expect(run(".a { color: var(--color-blue-yale); }")).not.toContain("var(");
	});

	it("leaves the tokens file alone when base.css imports it", () => {
		expect(runImported(":root { --color-link-base: var(--color-blue-medium); }", TOKENS_FILE)).toContain(
			"var(--color-blue-medium)",
		);
	});

	describe("unknown token-like names", () => {
		// A token renamed in a tokens release, read with a fallback, would otherwise switch to the fallback unnoticed.
		it("fails on a renamed token read with a fallback, naming the file and the property", () => {
			expect(() => run(".a { border-radius: var(--radius-renamed-in-a-release, 4px); }")).toThrow(
				/fixture\.css[\s\S]*border-radius[\s\S]*--radius-renamed-in-a-release/,
			);
		});

		it("fails on a shadow-root stylesheet imported with ?inline", () => {
			expect(() => run(".a { color: var(--color-renamed-in-a-release, red); }", `${FILE}?inline`)).toThrow(
				/--color-renamed-in-a-release/,
			);
		});

		it("fails on a renamed token read without a fallback", () => {
			expect(() => run(".a { color: var(--color-renamed-in-a-release); }")).toThrow(/--color-renamed-in-a-release/);
		});

		it("fails on one inside another var()'s fallback", () => {
			expect(() => run(".a { color: var(--color-text, var(--color-renamed-in-a-release)); }")).toThrow(
				/--color-renamed-in-a-release/,
			);
		});

		it("allows a name the same file declares", () => {
			expect(() => run(".a { --color-fixture-accent: red; color: var(--color-fixture-accent, blue); }")).not.toThrow();
		});

		it("allows a name another component declares", () => {
			// Declared in text-input, select-input and textarea.
			expect(() => run(".a { border-color: var(--color-form-item-border-focus); }")).not.toThrow();
		});

		it("allows THEMEABLE names", () => {
			expect(() => run(".a { color: var(--color-text); background: var(--color-background, white); }")).not.toThrow();
		});

		it("allows names the page provides on purpose", () => {
			expect(() => run(".a { color: var(--color-theme-primary, var(--color-blue-yale)); }")).not.toThrow();
		});

		it("ignores names that don't share a prefix with any token", () => {
			expect(() => run(".a { margin: var(--fixture-gutter, 1rem); }")).not.toThrow();
		});

		it("ignores CSS outside src/", () => {
			expect(() => run(".a { color: var(--color-renamed-in-a-release, red); }", OUTSIDE)).not.toThrow();
		});

		it("ignores CSS from outside src/ that base.css imports", () => {
			expect(() => runImported(".a { color: var(--color-renamed-in-a-release, red); }", OUTSIDE)).not.toThrow();
		});
	});
});
