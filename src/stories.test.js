import { describe, expect, it } from "vitest";
import * as previewModule from "../.storybook/preview.js";

// Every stories file, imported for real so their component modules register their elements.
const modules = import.meta.glob("./**/*.stories.js", { eager: true });

// The exported stories, plus the meta's own render as its own entry when every story overrides it
// (otherwise a story already exercises it).
const storiesOf = (module) => {
	const stories = Object.entries(module).filter(([name, value]) => name !== "default" && value && typeof value === "object");
	if (module.default.render && stories.every(([, story]) => story.render)) stories.push(["(meta render)", {}]);
	return stories;
};

const controlType = (argType) => (typeof argType?.control === "object" ? argType.control?.type : argType?.control);

// Storybook maps an option through argTypes mapping before render sees it.
const mapArgs = (args, argTypes) =>
	Object.fromEntries(
		Object.entries(args).map(([key, value]) => {
			const mapping = argTypes[key]?.mapping;
			return [key, mapping && value in mapping ? mapping[value] : value];
		}),
	);

// A user can clear any text control or untick any boolean; selects and numbers keep their value.
const clearControls = (args, argTypes) =>
	Object.fromEntries(
		Object.entries(args).map(([key, value]) => {
			const type = controlType(argTypes[key]);
			return [key, type === "text" ? "" : type === "boolean" ? false : value];
		}),
	);

const renderStory = (meta, story, args, argTypes) => {
	const render = story.render ?? meta.render;
	if (!render) return "";
	const mapped = mapArgs(args, argTypes);
	const result = render(mapped, { args: mapped, argTypes });
	return result instanceof Node ? result.outerHTML : String(result);
};

const kebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

// "false" and "null" are only real attribute values when an arg's selected option is that literal
// string, and then only on the attribute named after that arg (controlType -> control-type).
const literalAttributes = (args, argTypes) => {
	const mapped = mapArgs(args, argTypes);
	return new Set(
		Object.keys(args)
			.filter((key) => (argTypes[key]?.options ?? []).includes(args[key]))
			.filter((key) => ["false", "null"].includes(String(mapped[key])))
			.map((key) => `${kebab(key)}="${mapped[key]}"`),
	);
};

// Everything that shows an unset arg leaked into the markup: "undefined" anywhere (including
// suffixes like animate-undefined), attributes set to "null" or "false" that no selected option
// accounts for, and false/null/undefined/NaN tokens inside a class list.
const leaksIn = (html, args, argTypes) => {
	const leaks = [...html.matchAll(/[^\s"'<>=]*undefined[^\s"'<>]*/g)].map(([match]) => match);
	const allowed = literalAttributes(args, argTypes);
	leaks.push(...[...html.matchAll(/[\w-]+="(?:null|false)"/g)].map(([match]) => match).filter((match) => !allowed.has(match)));
	for (const [, classes] of html.matchAll(/\sclass="([^"]*)"/g)) {
		const bad = classes.split(/\s+/).filter((token) => /^(false|null|undefined|NaN)$|-(false|null|undefined|NaN)$|\[object/.test(token));
		if (bad.length) leaks.push(`class="${classes}"`);
	}
	if (html.includes("[object Object]")) leaks.push("[object Object]");
	return [...new Set(leaks)];
};

const OPTION_CONTROLS = ["select", "radio", "inline-radio"];

// The arg sets a user can reach from the story's defaults: the defaults themselves, every text
// control cleared and boolean unticked, each option of each select or radio control on its own,
// and each boolean ticked on its own.
const variantsOf = (args, argTypes) => {
	const variants = [
		["default args", args],
		["controls cleared", clearControls(args, argTypes)],
	];
	for (const [key, argType] of Object.entries(argTypes)) {
		const type = controlType(argType);
		if (OPTION_CONTROLS.includes(type)) {
			for (const option of argType.options ?? []) {
				if (option !== args[key]) variants.push([`${key}: ${JSON.stringify(option)}`, { ...args, [key]: option }]);
			}
		} else if (type === "boolean" && args[key] !== true) {
			variants.push([`${key}: true`, { ...args, [key]: true }]);
		}
	}
	return variants;
};

describe("stories", () => {
	it("finds stories files", () => {
		expect(Object.keys(modules).length).toBeGreaterThan(0);
	});

	describe.each(Object.entries(modules))("%s", (_path, module) => {
		const meta = module.default;

		it("names a registered custom element as its component", () => {
			expect(meta.component).toBeTruthy();
			expect(customElements.get(meta.component), `${meta.component} is not registered`).toBeDefined();
		});

		describe.each(storiesOf(module))("%s", (_name, story) => {
			const args = { ...meta.args, ...story.args };
			const argTypes = { ...meta.argTypes, ...story.argTypes };

			it("renders its component without leaking unset values, for every control variant", () => {
				const problems = [];
				for (const [label, variant] of variantsOf(args, argTypes)) {
					const html = renderStory(meta, story, variant, argTypes);
					if (!html.includes(`<${meta.component}`)) problems.push(`${label}: does not render <${meta.component}>`);
					for (const leak of leaksIn(html, variant, argTypes)) problems.push(`${label}: ${leak}`);
				}
				expect(problems).toEqual([]);
			});
		});
	});

	it("turns on autodocs in the preview", () => {
		const preview = previewModule.default ?? previewModule;
		expect(preview.tags ?? []).toContain("autodocs");
	});
});
