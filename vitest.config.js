import { defineConfig, mergeConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import viteConfig from "./vite.config.js";

// Tests run in a real browser (Chromium via Playwright): the components lean on ElementInternals,
// constructable stylesheets, slot assignment and <dialog>, which jsdom doesn't fully implement.
// A fresh object per project: Vitest names the instances in place, so sharing one collides.
const browser = () => ({
	enabled: true,
	provider: playwright(),
	headless: true,
	instances: [{ browser: "chromium" }],
});

export default defineConfig((env) =>
	mergeConfig(viteConfig(env), {
		test: {
			projects: [
				{
					extends: true,
					test: {
						name: "unit",
						include: ["src/**/*.test.js"],
						setupFiles: ["test/setup.js"],
						restoreMocks: true,
						browser: browser(),
					},
				},
				// Renders every story (and runs any play function) using .storybook/preview.js.
				{
					extends: true,
					plugins: [storybookTest({ configDir: ".storybook" })],
					test: {
						name: "storybook",
						browser: browser(),
					},
				},
			],
		},
	}),
);
