import "./WrappedImage";

// Self-contained placeholder so the stories don't depend on an image host.
const placeholder = (w, h) => `data:image/svg+xml,${encodeURIComponent(
	`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#dddddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(h / 8)}" fill="#4a4a4a">${w} x ${h}</text></svg>`
)}`;

export default {
	title: "Wrapped Image",
	component: "ycl-wrapped-image",
	argTypes: {
		caption: { control: "text" },
		alignment: {
			name: "Image Alignment",
			type: "select",
			options: ["left", "right"],
		},
		imageStyle: {
			name: "Image Style",
			type: "select",
			options: ["floated", "offset"],
		},
	},
	args: {
		caption: "Dr. Davis's research group at the Kline Chemistry Laboratory.",
		alignment: "left",
		imageStyle: "floated",
	},

	render: (args) =>
		`<ycl-wrapped-image alignment="${args.alignment}" image-style="${args.imageStyle}">
			<img slot="image" src="${placeholder(900, 600)}" alt="Researchers working in a laboratory">
			${args.caption ? `<p slot="caption">${args.caption}</p>` : ""}
			<p>Dr. Davis’s research group at the Kline Chemistry Laboratory uses experiments at multiple scales – in vitro, single cell, and whole organism – to study fundamental and applied problems at the intersection of chemistry, physics, and biology. They develop new quantitative spectroscopic imaging techniques to elucidate the relationship between function and dynamics of proteins and RNA inside living cells.</p>
			<p>Caitlin Davis obtained her Ph.D. from Emory University in 2015, where she studied protein folding in the laboratory of Dr. Brian Dyer in the Chemistry Department. She completed her postdoctoral training with Dr. Martin Gruebele at the Center for the Physics of Living Cells at the University of Illinois at Urbana-Champaign, where she developed a method for studying protein thermodynamics and kinetics in differentiated tissues of living zebrafish and she developed a mimic of cytoplasm that can be used to reproduce protein behaviors in vitro. She came to <a href="https://www.yale.edu">Yale</a> as a faculty member in 2020.</p>
		</ycl-wrapped-image>`,
};

export const Default = {};

export const AlignedRight = {
	args: { alignment: "right" },
};

export const Offset = {
	args: { imageStyle: "offset" },
};
