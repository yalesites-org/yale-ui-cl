import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		lib: {
			entry: resolve(import.meta.dirname, "src/main.js"),
			name: "YaleUiCl",
			fileName: "yale-ui-cl",
			formats: ["es", "umd"],
		},
	},
});
