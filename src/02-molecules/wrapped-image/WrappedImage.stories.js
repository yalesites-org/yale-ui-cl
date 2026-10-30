import "./WrappedImage";
import "../../01-atoms/image/ResponsiveImage";
import "../../01-atoms/text-link/Link";
import { attrs, attributeArg, slotArg, placeholder } from "../../../.storybook/story-helpers.js";

export default {
	title: "Molecules/Wrapped Image",
	component: "ycl-wrapped-image",
	argTypes: {
		alignment: attributeArg("Side the image floats on; left is the default.", {
			name: "Image Alignment",
			control: "select",
			options: ["left", "right"],
			mapping: { left: undefined },
		}),
		imageStyle: attributeArg("image-style: offset pulls the image out past the text column; floated is the default.", {
			name: "Image Style",
			control: "select",
			options: ["floated", "offset"],
			mapping: { floated: undefined },
		}),
		image: slotArg("The image (slot=\"image\").", { control: false }),
		caption: slotArg("Image caption (slot=\"caption\"). Omitted when empty.", { control: "text" }),
		text: slotArg("Body text that wraps around the image (default slot).", { control: false }),
	},
	args: {
		caption: "Dr. Davis's research group at the Kline Chemistry Laboratory.",
		alignment: "left",
		imageStyle: "floated",
	},

	render: (args) =>
		`<ycl-wrapped-image${attrs({ alignment: args.alignment, "image-style": args.imageStyle })}>
			<ycl-image slot="image"><img src="${placeholder(900, 600)}" alt="Researchers working in a laboratory"></ycl-image>
			${args.caption ? `<p slot="caption">${args.caption}</p>` : ""}
			<p>Dr. Davis’s research group at the Kline Chemistry Laboratory uses experiments at multiple scales – in vitro, single cell, and whole organism – to study fundamental and applied problems at the intersection of chemistry, physics, and biology. They develop new quantitative spectroscopic imaging techniques to elucidate the relationship between function and dynamics of proteins and RNA inside living cells.</p>
			<p>Caitlin Davis obtained her Ph.D. from Emory University in 2015, where she studied protein folding in the laboratory of Dr. Brian Dyer in the Chemistry Department. She completed her postdoctoral training with Dr. Martin Gruebele at the Center for the Physics of Living Cells at the University of Illinois at Urbana-Champaign, where she developed a method for studying protein thermodynamics and kinetics in differentiated tissues of living zebrafish and she developed a mimic of cytoplasm that can be used to reproduce protein behaviors in vitro. She came to <text-link href="https://www.yale.edu">Yale</text-link> as a faculty member in 2020.</p>
		</ycl-wrapped-image>`,
};

export const Default = {};
