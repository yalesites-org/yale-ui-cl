import "./TileItem";
import "../../01-atoms/icons/Icon";
import "../../01-atoms/image/ResponsiveImage";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme, placeholder } from "../../../.storybook/story-helpers.js";

// Decorative, so unlabelled; an inline SVG can also go in the icon slot.
const icon = `<ycl-icon slot="icon" name="lightbulb-solid"></ycl-icon>`;

const tile = (args, heading) => `
	<li>
		<ycl-tile-item${attrs({
			theme: args.theme,
			alignment: args.alignment,
			"vertical-alignment": args.verticalAlignment,
			href: args.href,
			animated: args.animated,
			style: "min-height: 18rem;",
		})}>
			${args.presentation === "icon" ? icon : ""}
			${args.presentation === "heading" && heading ? `<span slot="heading">${heading}</span>` : ""}
			${args.withImage ? `<ycl-image slot="image"><img src="${placeholder(600, 600)}" alt=""></ycl-image>` : ""}
			${args.content ?? ""}
		</ycl-tile-item>
	</li>`;

export default {
	title: "Molecules/Tile Item",
	component: "ycl-tile-item",
	argTypes: {
		href: attributeArg("Makes the content a link to this URL.", { name: "Content Link", control: "text" }),
		alignment: attributeArg("Horizontal alignment; left is the default.", {
			control: "select",
			options: ["left", "center", "right"],
			mapping: { left: undefined },
		}),
		verticalAlignment: attributeArg("vertical-alignment: where the content sits in the tile; top is the default.", {
			name: "Vertical Alignment",
			control: "select",
			options: ["top", "bottom"],
			mapping: { top: undefined },
		}),
		theme: attributeArg("Color theme; one is the default.", {
			name: "Component Theme",
			control: "select",
			options: ["one", "two", "three", "four", "five", "six"],
			mapping: { one: undefined },
		}),
		animated: attributeArg("Adds a hover animation.", { name: "With Animation", control: "boolean" }),
		presentation: slotArg("What fills the top of the tile: the heading slot, the icon slot (an icon or inline SVG), or nothing.", {
			name: "Presentation Style",
			control: "select",
			options: ["heading", "icon", "text-only"],
		}),
		heading: slotArg("Heading of the first tile (slot=\"heading\"), used when Presentation Style is heading.", { control: "text" }),
		content: slotArg("Tile text (default slot).", { control: "text" }),
		withImage: slotArg("Fill the image slot (slot=\"image\").", { name: "With Image", control: "boolean" }),
		globalTheme: globalThemeArgType,
	},
	args: {
		heading: "01",
		content: "This is a tile item with content!",
		href: "https://www.yale.edu",
		presentation: "heading",
		alignment: "left",
		verticalAlignment: "top",
		theme: "one",
		withImage: false,
		animated: false,
		globalTheme: "one",
	},

	render: (args) => withGlobalTheme(args.globalTheme, `
			<ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: var(--size-spacing-6);">
				${tile(args, args.heading)}
				${tile(args, "02")}
				${tile(args, "03")}
			</ul>`),
};

export const Default = {};
