import "../../02-molecules/callout/Callout";
import "../../02-molecules/banner/action/ActionBanner";
import "../../02-molecules/quote-callout/QuoteCallout";
import "../../02-molecules/tile-item/TileItem";
import "../../02-molecules/facts-and-figures/FactsAndFigures";
import "../../02-molecules/inline-message/InlineMessage";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/cta/Cta";
import "../../01-atoms/text-link/Link";

// The page palette: five inherited custom properties that every themed component reads. Their
// defaults are the Old Blues colours components fall back to when a page sets nothing.
const PALETTE = {
	primary: { label: "Primary", fallback: "#00366b" },
	secondary: { label: "Secondary", fallback: "#276bbe" },
	tertiary: { label: "Tertiary", fallback: "#61a8ff" },
	"accent-1": { label: "Accent 1", fallback: "#f7f7f7" },
	"accent-2": { label: "Accent 2", fallback: "#212121" },
};

const names = Object.keys(PALETTE);
const argName = (name) => name.replace(/-(\d)/, "$1");

const paletteStyle = (args) => names.map((name) => `--color-theme-${name}: ${args[argName(name)]};`).join(" ");

const swatches = (args) => `
	<ul style="list-style: none; padding: 0; margin: 0 0 var(--size-spacing-7); display: flex; flex-wrap: wrap; gap: var(--size-spacing-4);">
		${names.map((name) => `<li style="display: flex; align-items: center; gap: var(--size-spacing-2);">
			<span style="display: inline-block; width: 2rem; height: 2rem; border: 1px solid var(--color-gray-300); background: var(--color-theme-${name});"></span>
			<code>--color-theme-${name}</code> ${args[argName(name)]}
		</li>`).join("")}
	</ul>`;

const components = (option) => `
	<div style="display: grid; gap: var(--size-spacing-7);">
		<ycl-callout theme="${option}">
			<ycl-callout-item>
				<ycl-heading level="2" slot="heading">Degree Programs</ycl-heading>
				<p>Designed for those who intend to pursue graduate study or a career in the sciences.</p>
				<cta-link slot="link" class="outline" href="https://www.yale.edu">Programs</cta-link>
			</ycl-callout-item>
		</ycl-callout>
		<ycl-action-banner theme="${option}">
			<ycl-heading level="2" slot="heading">Visit campus</ycl-heading>
			<p>Tours run every weekday during the academic year.</p>
			<cta-link slot="actions" class="filled" href="https://www.yale.edu">Plan a visit</cta-link>
		</ycl-action-banner>
		<ycl-quote-callout theme="${option}">
			<p>Light and truth.</p>
			<span slot="attribution">Yale motto</span>
		</ycl-quote-callout>
		<ycl-inline-message theme="${option}">
			<ycl-heading level="2" slot="heading">Registration is open</ycl-heading>
			<p>Register for spring courses by January 10.</p>
			<text-link slot="link" href="https://www.yale.edu">Course registration</text-link>
		</ycl-inline-message>
		<ul style="list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: var(--size-spacing-6);">
			<li>
				<ycl-tile-item theme="${option}" style="min-height: 14rem;">
					<span slot="heading">01</span>
					Residential colleges anchor undergraduate life.
				</ycl-tile-item>
			</li>
			<li>
				<ycl-facts-and-figures theme="${option}" padded>
					<span slot="stat">6:1</span>
					Student to faculty ratio
				</ycl-facts-and-figures>
			</li>
		</ul>
	</div>`;

export default {
	title: "Tokens/Theme Builder",
	parameters: {
		layout: "padded",
		docs: {
			description: {
				component:
					"Pick the five palette colours and see how themed components use them. A page sets the same custom properties on any ancestor of the components (for example `:root`), and each component chooses a palette colour with its `theme` attribute. Check the contrast of the colours you pick: text colours on each option are fixed for the default palette.",
			},
		},
	},
	argTypes: {
		...Object.fromEntries(
			names.map((name) => [argName(name), { name: PALETTE[name].label, control: "color" }]),
		),
		option: {
			name: "Color Option",
			control: "select",
			options: names,
		},
	},
	args: {
		...Object.fromEntries(names.map((name) => [argName(name), PALETTE[name].fallback])),
		option: "primary",
	},
	render: (args) =>
		`<div style="${paletteStyle(args)}">
			${swatches(args)}
			${components(args.option)}
		</div>`,
};

export const Builder = {};

// Every option side by side, using callouts.
export const AllOptions = {
	render: (args) =>
		`<div style="${paletteStyle(args)} display: grid; gap: var(--size-spacing-5);">
			${names.map((name) => `<ycl-callout theme="${name}">
				<ycl-callout-item>
					<ycl-heading level="2" slot="heading">${PALETTE[name].label}</ycl-heading>
					<p>The ${name} colour option.</p>
					<cta-link slot="link" class="outline" href="https://www.yale.edu">Learn more</cta-link>
				</ycl-callout-item>
			</ycl-callout>`).join("")}
		</div>`,
};
