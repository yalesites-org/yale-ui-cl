import "./ContentSpotlightPortrait";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/text-link/Link";
import "../../01-atoms/image/ResponsiveImage";
import { attrs, attributeArg, slotArg, placeholder } from "../../../.storybook/story-helpers.js";
import { COLOR_OPTION_DESCRIPTION, colorOptionLabels } from "../../00-tokens/theme/color-options.js";

const selectArg = (name, options, description) => attributeArg(description, { name, control: "select", options });
const textSlot = (description, extra) => slotArg(`${description} Omitted when empty.`, { control: "text", ...extra });

export default {
	title: "Organisms/Content Spotlight Portrait",
	component: "ycl-content-spotlight-portrait",
	argTypes: {
		theme: attributeArg(COLOR_OPTION_DESCRIPTION, {
			name: "Color Option",
			options: ["default", "primary", "secondary", "tertiary", "accent-1", "accent-2"],
			control: { type: "select", labels: colorOptionLabels("ycl-content-spotlight-portrait") },
		}),
		position: selectArg("Image Position", ["image-left", "image-right"], "Which side the portrait sits on. Defaults to image-left."),
		verticalAlign: selectArg("Content Vertical Alignment", ["top", "middle", "bottom"], "vertical-align: vertical alignment of the content beside the image."),
		imageStyle: selectArg("Image Style", ["inline", "offset"], "image-style: inline, or offset so the image overlaps the background."),
		image: slotArg("Portrait image (slot=\"image\"), usually a ycl-image.", { control: false }),
		caption: textSlot("Image caption (slot=\"caption\")."),
		overline: textSlot("Text above the heading (slot=\"overline\")."),
		heading: textSlot("Heading (slot=\"heading\")."),
		subheading: textSlot("Text below the heading (slot=\"subheading\")."),
		text: textSlot("Body text (default slot); may contain markup."),
		linkContent: textSlot("First link (slot=\"ctas\").", { name: "Link Content" }),
		linkTwoContent: textSlot("Second link (slot=\"ctas\").", { name: "Second Link Content" }),
	},
	args: {
		overline: "By Charlyn Paradis",
		heading: "Admitted Students Envision Themselves as Yale Chemists During Visiting Days",
		subheading: "Submitted February 28, 2022",
		text: "Prospective students joined the <ycl-text-link href=\"https://www.yale.edu\">Yale</ycl-text-link> Chemistry community on Feb. 10 – 11 to learn about the research program and campus life at the much anticipated ‘Visiting Days’ event.",
		linkContent: "Visiting Days",
		linkTwoContent: "View all featured content",
		caption: "This is an image caption.",
		theme: "default",
		position: "image-left",
		verticalAlign: "middle",
		imageStyle: "inline",
	},

	render: (args) => {
		const slots = [
			`<ycl-image slot="image"><img src="${placeholder(400, 600)}" alt="Portrait of a chemistry student"></ycl-image>`,
			args.caption ? `<p slot="caption">${args.caption}</p>` : "",
			args.overline ? `<p slot="overline">${args.overline}</p>` : "",
			args.heading ? `<ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : "",
			args.subheading ? `<p slot="subheading">${args.subheading}</p>` : "",
			args.linkContent ? `<ycl-text-link slot="ctas" href="https://www.yale.edu">${args.linkContent}</ycl-text-link>` : "",
			args.linkTwoContent ? `<ycl-text-link slot="ctas" href="https://www.yale.edu">${args.linkTwoContent}</ycl-text-link>` : "",
			args.text ? `<p>${args.text}</p>` : "",
		].filter(Boolean);
		return `
			<ycl-content-spotlight-portrait${attrs({
				theme: args.theme,
				position: args.position,
				'vertical-align': args.verticalAlign,
				'image-style': args.imageStyle,
			})}>
				${slots.join("\n\t\t\t\t")}
			</ycl-content-spotlight-portrait>`;
	},
};

export const Default = {};
