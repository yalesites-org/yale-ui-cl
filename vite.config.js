import { globSync, readFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { defineConfig } from "vite";
import lockTokens from "./postcss/lock-tokens.js";

// One ES entry per component module, named after the tag of the class the file is named for
// (Tabs.js -> ycl-tabs, not ycl-tab) minus the ycl-/yc- prefix, so `import "yale-ui-cl/accordion"`
// registers ycl-accordion and ycl-accordion-item. These names are public import paths.
function componentEntries() {
	const entries = {};
	for (const file of globSync("src/0*-*/**/*.js", { exclude: (f) => f.endsWith(".stories.js") })) {
		const tags = new Map(
			[...readFileSync(file, "utf8").matchAll(/customElements\.define\(["']([\w-]+)["'], (\w+)\)/g)].map((m) => [m[2], m[1]]),
		);
		if (!tags.size) continue;
		const tag = tags.get(basename(file, ".js")) ?? [...tags.values()][0];
		const name = tag.replace(/^ycl?-/, "");
		if (entries[name]) throw new Error(`Entry name "${name}" is used by both ${entries[name]} and ${file}`);
		entries[name] = resolve(import.meta.dirname, file);
	}
	return entries;
}

// `vite build` emits the per-component ES entries (plus shared chunks); `vite build --mode bundle`
// then adds the standalone full-library bundle (ES + UMD) and the document stylesheet alongside
// them. UMD can't have multiple entries, hence two passes. See the "build" script.
export default defineConfig(({ mode }) => ({
	css: {
		postcss: {
			plugins: [lockTokens()],
		},
	},
	build: {
		lib:
			mode === "bundle"
				? {
						entry: resolve(import.meta.dirname, "src/main.js"),
						name: "YaleUiCl",
						fileName: "yale-ui-cl",
						cssFileName: "yale-ui-cl",
						formats: ["es", "umd"],
					}
				: {
						entry: componentEntries(),
						fileName: (_format, entryName) => `${entryName}.js`,
						formats: ["es"],
					},
		rollupOptions: {
			output: {
				chunkFileNames: "chunks/[name]-[hash].js",
			},
		},
		emptyOutDir: mode !== "bundle",
		sourcemap: true,
	},
}));
