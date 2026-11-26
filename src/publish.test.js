import { describe, expect, it } from "vitest";
import pkg from "../package.json";
import release from "../.github/workflows/release.yaml?raw";
import readme from "../README.md?raw";
import welcome from "./Welcome.mdx?raw";
import "./main.js";

// UICL is published to npm on every release, so a plain HTML page can load it from jsDelivr with one
// <script> and one <link>. These tests keep the package, the release workflow and the docs in step.

const CDN = "https://cdn.jsdelivr.net/npm/yale-ui-cl@";

describe("npm package", () => {
	it("can be published publicly", () => {
		expect(pkg.private).not.toBe(true);
		expect(pkg.name).toBe("yale-ui-cl");
		expect(pkg.publishConfig).toMatchObject({ access: "public", registry: "https://registry.npmjs.org/" });
	});

	it("points CDNs at the full bundle (jsDelivr and unpkg fall back to main)", () => {
		expect(pkg.main).toBe("./dist/yale-ui-cl.js");
	});

	it("keeps the stylesheet and per-component entries exported", () => {
		expect(pkg.exports["./style.css"]).toBe("./dist/yale-ui-cl.css");
		expect(pkg.exports["./*"]).toBe("./dist/*.js");
		expect(pkg.files).toContain("dist");
	});
});

describe("release workflow", () => {
	// The text of the publish job: from its key to the next top-level job (or the end of the file).
	const job = release.match(/\n {2}publish-npm:\n[\s\S]*?(?=\n {2}[\w-]+:\n|$)/)?.[0] ?? "";

	it("has a publish-npm job", () => {
		expect(job).not.toBe("");
	});

	it("publishes only when release-please cut a release, from the release tag", () => {
		expect(job).toMatch(/needs: release-please/);
		expect(job).toMatch(/if: \$\{\{ needs\.release-please\.outputs\.release_created == 'true' \}\}/);
		expect(job).toMatch(/ref: \$\{\{ needs\.release-please\.outputs\.tag_name \}\}/);
	});

	it("publishes with provenance", () => {
		expect(job).toMatch(/id-token: write/);
		expect(job).toMatch(/npm publish --provenance/);
		expect(job).toMatch(/NODE_AUTH_TOKEN: \$\{\{ secrets\.NPM_TOKEN \}\}/);
	});

	it("builds before publishing, so no build tool runs with the npm token", () => {
		expect(job).toMatch(/- run: npm run build\n/);
		expect(job).toMatch(/npm publish --provenance --ignore-scripts/);
		expect(job.indexOf("npm run build")).toBeLessThan(job.indexOf("npm publish"));
	});
});

describe.each([
	["README.md", readme],
	["Welcome.mdx", welcome],
])("%s", (_name, text) => {
	it("loads the library with one stylesheet and one script tag from the CDN", () => {
		expect(text).toContain(`<link rel="stylesheet" href="${CDN}1/dist/yale-ui-cl.css">`);
		expect(text).toContain(`<script type="module" src="${CDN}1/dist/yale-ui-cl.js"></script>`);
	});

	it("shows a single-component import from the CDN", () => {
		expect(text).toContain(`${CDN}1/dist/button.js`);
	});

	it("shows the npm install", () => {
		expect(text).toContain("npm install yale-ui-cl");
	});
});

it("README says why UICL is published to npm", () => {
	expect(readme).toMatch(/^### Why npm$/m);
});

describe("Welcome page example", () => {
	const page = welcome.match(/```html\n(<!doctype html>[\s\S]*?)```/i)?.[1] ?? "";

	it("is a complete HTML page", () => {
		expect(page).toMatch(/^<!doctype html>/i);
		expect(page).toMatch(/<\/html>\s*$/);
	});

	it("uses a few components, all of which exist", () => {
		const tags = [...new Set([...page.matchAll(/<(ycl-[\w-]+)/g)].map((m) => m[1]))];
		expect(tags.length).toBeGreaterThanOrEqual(3);
		for (const tag of tags) expect(customElements.get(tag), tag).toBeDefined();
	});
});
