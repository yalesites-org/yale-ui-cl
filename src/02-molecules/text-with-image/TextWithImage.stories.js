import "./TextWithImage";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/text-link/Link";
import "../../01-atoms/image/ResponsiveImage";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme, placeholder } from "../../../.storybook/story-helpers.js";

// Each attribute's default value is left off the markup.
const selectArg = (description, options, extra) =>
	attributeArg(description, { control: "select", options, mapping: { [options[0]]: undefined }, ...extra });

export default {
	title: "Molecules/Content Spotlight Landscape",
	component: "ycl-text-with-image",
	argTypes: {
		theme: selectArg("Background theme.", ["default", "one", "two", "three", "four", "five", "six"], { name: "Component Theme" }),
		width: selectArg("Maximum width; highlight is wider than site.", ["site", "highlight"]),
		position: selectArg("Which side the image sits on.", ["image-left", "image-right"], { name: "Image Position" }),
		verticalAlign: selectArg("vertical-align: vertical alignment of the content beside the image.", ["top", "middle", "bottom"], {
			name: "Content Vertical Alignment",
		}),
		imageStyle: selectArg("image-style: offset overlaps the content and image.", ["inline", "offset"], { name: "Image Style" }),
		focus: selectArg("Which side gets more of the width.", ["equal", "image", "content"]),
		overline: slotArg("Text above the heading (slot=\"overline\"). Omitted when empty.", { control: "text" }),
		heading: slotArg("Heading (slot=\"heading\").", { control: "text" }),
		subheading: slotArg("Text below the heading (slot=\"subheading\"). Omitted when empty.", { control: "text" }),
		text: slotArg("Body text (default slot).", { control: "text" }),
		linkContent: slotArg("First link (slot=\"ctas\"). Omitted when empty.", { name: "Link Content", control: "text" }),
		linkTwoContent: slotArg("Second link (slot=\"ctas\"). Omitted when empty.", { name: "Second Link Content", control: "text" }),
		image: slotArg("The image (slot=\"image\").", { control: false }),
		caption: slotArg("Image caption (slot=\"caption\"). Omitted when empty.", { control: "text" }),
		globalTheme: globalThemeArgType,
	},
	args: {
		overline: "By Charlyn Paradis",
		heading: "Admitted Students Envision Themselves as Yale Chemists During Visiting Days",
		subheading: "Submitted February 28, 2022",
		text: "Prospective students joined the Yale Chemistry community on Feb. 10 – 11 to learn about the research program and campus life at the much anticipated ‘Visiting Days’ event. See more at <text-link href=\"https://www.yale.edu\">Yale</text-link>.",
		linkContent: "Visiting Days",
		linkTwoContent: "View all featured content",
		caption: "This is an image caption.",
		theme: "default",
		width: "site",
		position: "image-left",
		verticalAlign: "top",
		imageStyle: "inline",
		focus: "equal",
		globalTheme: "one",
	},

	render: (args) => withGlobalTheme(args.globalTheme, `
			<ycl-text-with-image${attrs({
				theme: args.theme,
				width: args.width,
				position: args.position,
				"vertical-align": args.verticalAlign,
				"image-style": args.imageStyle,
				focus: args.focus,
			})}>
				<ycl-image slot="image"><img src="${placeholder(900, 600)}" alt="Students touring a chemistry lab"></ycl-image>
				${args.caption ? `<p slot="caption">${args.caption}</p>` : ""}
				${args.overline ? `<p slot="overline">${args.overline}</p>` : ""}
				<ycl-heading level="2" slot="heading">${args.heading ?? ""}</ycl-heading>
				${args.subheading ? `<p slot="subheading">${args.subheading}</p>` : ""}
				${args.linkContent ? `<text-link slot="ctas" href="https://www.yale.edu">${args.linkContent}</text-link>` : ""}
				${args.linkTwoContent ? `<text-link slot="ctas" href="https://www.yale.edu">${args.linkTwoContent}</text-link>` : ""}
				${args.text ? `<p>${args.text}</p>` : ""}
			</ycl-text-with-image>`),
};

export const Default = {};
