import "./CustomCard";
import "../../../01-atoms/headings/Heading";
import "../../../01-atoms/image/ResponsiveImage";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme, placeholder } from "../../../../.storybook/story-helpers.js";

const card = (args, heading, snippet) =>
	`<ycl-custom-card${attrs({ href: args.href, featured: args.featured })}>${args.withImage ? `
			<ycl-image slot="image" ratio="3x2"><img src="${placeholder(600, 400)}" alt=""></ycl-image>` : ""}${heading ? `
			<ycl-heading level="3" slot="heading">${heading}</ycl-heading>` : ""}${snippet ? `
			<p>${snippet}</p>` : ""}
		</ycl-custom-card>`;

export default {
	title: "Molecules/Cards/Custom Card",
	component: "ycl-custom-card",
	argTypes: {
		href: attributeArg("Card link. The whole card is clickable; without it the card is not a link.", { control: "text" }),
		featured: attributeArg("Featured (larger) card style.", { control: "boolean" }),
		heading: slotArg("Card heading (slot=\"heading\"). Omitted when empty.", { control: "text" }),
		snippet: slotArg("Card text (default slot); hidden when empty.", { control: "text" }),
		withImage: slotArg("Card image (slot=\"image\"). Without one, a decorative colour bar shows instead.", {
			name: "With Image",
			control: "boolean",
		}),
		globalTheme: globalThemeArgType,
	},
	args: {
		heading: "Card Title",
		snippet: "Content goes here.",
		href: "https://www.yale.edu",
		featured: true,
		withImage: true,
		globalTheme: "one",
	},

	render: (args) => withGlobalTheme(args.globalTheme, `<div style="max-width: 24rem;">
			${card(args, args.heading, args.snippet)}
		</div>`),
};

export const Default = {};

export const CardGrid = {
	parameters: {
		docs: {
			description: {
				story: "Several cards in a list laid out as a grid. Controls edit a single card, so they cannot compose a group of them.",
			},
		},
	},
	render: (args) => withGlobalTheme(args.globalTheme, `<ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr)); gap: var(--size-spacing-8);">
			<li>${card(args, args.heading, args.snippet)}</li>
			<li>${card(args, "Undergraduate Research", "Find opportunities to work with faculty on original research.")}</li>
			<li>${card(args, "Visiting Campus", "Plan a visit, take a tour, and explore New Haven.")}</li>
		</ul>`),
};
