// One-line descriptions of the color options, shown as labels in each themed component's
// Storybook "Color Option" control. The README's Theming section uses the same wording.
// Colors are the default (Old Blues) palette; a page can change them.

export const COLOR_OPTION_DESCRIPTION = "Sets the component's color from the page palette.";

const COLORS = {
	primary: "Yale blue",
	secondary: "medium blue",
	tertiary: "light blue",
	"accent-1": "light gray",
	"accent-2": "dark gray",
};

const TEXT = {
	primary: "white",
	secondary: "white",
	tertiary: "gray-800",
	"accent-1": "gray-800",
	"accent-2": "white",
};

// Most options set the component's background and text color.
const SHARED = {
	default: "no background",
	...Object.fromEntries(Object.keys(COLORS).map((name) => [name, `${COLORS[name]} background, ${TEXT[name]} text`])),
};

// Components whose options color one part of the component instead of its background.
const ACCENTS = {
	"ycl-accordion": { part: "left bar on light gray items", default: "no bar, no background" },
	"ycl-image-banner": { part: "background behind the image" },
	"ycl-link-grid": { part: "column lines" },
	"ycl-pull-quote": { part: "quote bar or quote mark" },
	"ycl-tabs": { part: "top border on the selected tab" },
	"ycl-wrapped-callout": { part: "callout border", default: "no border color" },
};

// Single options that differ from the shared wording.
const OVERRIDES = {
	"ycl-facts-and-figures": { default: "no background, takes the text color around it" },
	"ycl-inline-message": { "accent-1": "light gray background, Yale blue text" },
};

// The description of each option for a component, keyed by option name.
export function colorOptionDescriptions(tag) {
	const accent = ACCENTS[tag];
	const descriptions = accent
		? {
				default: accent.default ?? SHARED.default,
				...Object.fromEntries(Object.keys(COLORS).map((name) => [name, `${COLORS[name]} ${accent.part}`])),
			}
		: SHARED;
	return { ...descriptions, ...OVERRIDES[tag] };
}

// The Storybook select labels for a component's options, e.g.
// { primary: "primary: Yale blue background, white text" }.
export function colorOptionLabels(tag) {
	return Object.fromEntries(
		Object.entries(colorOptionDescriptions(tag)).map(([option, description]) => [option, `${option}: ${description}`]),
	);
}
