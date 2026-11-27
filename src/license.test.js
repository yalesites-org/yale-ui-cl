import { describe, expect, it } from "vitest";
import pkg from "../package.json";
import readme from "../README.md?raw";

// The published package must grant people the right to use it: package.json names an SPDX
// license, a matching LICENSE file ships in the tarball, and the README says why it was chosen.
// LICENSE is loaded through a glob so a missing file fails the test instead of the import.
const licenseFiles = import.meta.glob("../LICENS[E]", { query: "?raw", import: "default", eager: true });
const licenseText = licenseFiles["../LICENSE"];

describe("package license", () => {
	it("names the MIT license in package.json", () => {
		expect(pkg.license).toBe("MIT");
	});

	it("has a LICENSE file with the MIT text", () => {
		expect(licenseText).toBeTypeOf("string");
		expect(licenseText).toMatch(/^MIT License/);
		expect(licenseText).toMatch(/Copyright \(c\) \d{4} Yale University/);
		expect(licenseText).toContain("Permission is hereby granted, free of charge");
	});

	it("ships the LICENSE file in the package", () => {
		expect(pkg.files).toContain("LICENSE");
	});

	it("explains the license choice in the README", () => {
		expect(readme).toMatch(/^## License$/m);
		expect(readme).toMatch(/MIT/);
	});
});
