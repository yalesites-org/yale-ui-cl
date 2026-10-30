import "./FactsAndFigures";
import "../../01-atoms/icons/Icon";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme } from "../../../.storybook/story-helpers.js";

// Decorative, so unlabelled; an inline SVG can also go in the icon slot.
const icon = (name) => `<ycl-icon slot="icon" name="${name}"></ycl-icon>`;

export default {
	title: "Molecules/Facts and Figures",
	component: "ycl-facts-and-figures",
	argTypes: {
		theme: attributeArg("Color theme.", {
			name: "Component Theme",
			control: "select",
			options: ["default", "one", "two", "three", "four", "five"],
		}),
		alignment: attributeArg("Center or left-align the content.", { control: "select", options: ["center", "left"] }),
		presentation: attributeArg("basic draws a rule above the stat; plain leaves it out.", {
			name: "Presentation Style",
			control: "select",
			options: ["basic", "plain"],
		}),
		padded: attributeArg("Adds inner padding, needed when the stat sits on a colored background.", { control: "boolean" }),
		stat: slotArg("The figure itself (slot=\"stat\").", { name: "Statistic", control: "text" }),
		content: slotArg("Description of the figure (default slot).", { control: "text" }),
		withIcon: slotArg("Decorative icon (slot=\"icon\"); its wrapper is hidden when empty.", { name: "With Icon", control: "boolean" }),
		globalTheme: globalThemeArgType,
	},
	args: {
		stat: "$52,000",
		content: "Annual grant of Undergraduate students",
		theme: "one",
		alignment: "center",
		presentation: "basic",
		padded: true,
		withIcon: false,
		globalTheme: "one",
	},

	render: (args) => withGlobalTheme(args.globalTheme, `<div style="max-width: 24rem;">
			<ycl-facts-and-figures${attrs({ theme: args.theme, alignment: args.alignment, presentation: args.presentation, padded: args.padded })}>
				${args.withIcon ? icon("hand-holding-dollar-solid") : ""}
				${args.stat ? `<span slot="stat">${args.stat}</span>` : ""}
				${args.content ?? ""}
			</ycl-facts-and-figures>
		</div>`),
};

export const Default = {};

export const Group = {
	parameters: {
		docs: {
			description: {
				story: "Several figures laid out together in a list. Controls render a single figure, so they cannot build a group.",
			},
		},
	},
	render: (args) => {
		const host = `ycl-facts-and-figures${attrs({ theme: args.theme, alignment: args.alignment, padded: args.padded })}`;
		return withGlobalTheme(args.globalTheme, `
			<ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: var(--size-spacing-6);">
				<li><${host}><span slot="stat">$52,000</span>Annual grant of Undergraduate students</ycl-facts-and-figures></li>
				<li><${host}><span slot="stat">6:1</span>Student to faculty ratio</ycl-facts-and-figures></li>
				<li><${host}>${icon("building-columns-solid")}<span slot="stat">14</span>Residential colleges</ycl-facts-and-figures></li>
			</ul>`);
	},
};
