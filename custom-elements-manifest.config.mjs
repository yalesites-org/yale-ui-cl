// Generates custom-elements.json, the machine-readable list of every element with its attributes,
// slots and events. Run `npm run analyze`; `build` and `build-storybook` run it first.
// Components are documented with JSDoc on each class (@attr, @slot, @fires, @csspart, @cssprop).

// Components keep internal state and handlers on public fields (this.link, clickHandler, ...).
// Only members with a JSDoc description are public API, so drop the rest from the manifest
// rather than listing every internal field as a property.
const publicMembersOnly = () => ({
	name: "public-members-only",
	packageLinkPhase({ customElementsManifest }) {
		for (const mod of customElementsManifest.modules) {
			for (const declaration of mod.declarations ?? []) {
				if (!declaration.customElement || !declaration.members) continue;
				declaration.members = declaration.members.filter((member) => member.description);
				if (!declaration.members.length) delete declaration.members;
			}
		}
	},
});

// The analyzer lists modules in the order the file glob returns them, which varies between runs.
// Sorting keeps the committed manifest stable, so regenerating it only shows real changes.
const sortModules = () => ({
	name: "sort-modules",
	packageLinkPhase({ customElementsManifest }) {
		customElementsManifest.modules.sort((a, b) => a.path.localeCompare(b.path));
	},
});

export default {
	globs: ["src/01-atoms/**/*.js", "src/02-molecules/**/*.js"],
	exclude: ["**/*.stories.js", "**/*.test.js"],
	outdir: ".",
	litelement: false,
	plugins: [publicMembersOnly(), sortModules()],
};
