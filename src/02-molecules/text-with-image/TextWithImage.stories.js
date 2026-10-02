import "./TextWithImage";
import "../../01-atoms/text-link/Link";

// Self-contained placeholder so the stories don't depend on an image host.
const placeholder = (w, h) => `data:image/svg+xml,${encodeURIComponent(
	`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#dddddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(h / 8)}" fill="#4a4a4a">${w} x ${h}</text></svg>`
)}`;

export default {
	title: "Content Spotlight Landscape",
	component: "ycl-text-with-image",
	argTypes: {
		overline: { control: "text" },
		heading: { control: "text" },
		subheading: { control: "text" },
		text: { control: "text" },
		linkContent: { name: "Link Content", control: "text" },
		linkTwoContent: { name: "Second Link Content", control: "text" },
		caption: { control: "text" },
		theme: {
			name: "Component Theme",
			type: "select",
			options: ["default", "one", "two", "three", "four", "five", "six"],
		},
		width: {
			type: "select",
			options: ["site", "highlight"],
		},
		position: {
			name: "Image Position",
			type: "select",
			options: ["image-left", "image-right"],
		},
		verticalAlign: {
			name: "Content Vertical Alignment",
			type: "select",
			options: ["top", "middle", "bottom"],
		},
		imageStyle: {
			name: "Image Style",
			type: "select",
			options: ["inline", "offset"],
		},
		focus: {
			type: "select",
			options: ["equal", "image", "content"],
		},
		globalTheme: {
			name: "Site Global Theme",
			type: "select",
			options: ["one", "two", "three", "four", "five", "six"],
		},
	},
	args: {
		overline: "By Charlyn Paradis",
		heading: "Admitted Students Envision Themselves as Yale Chemists During Visiting Days",
		subheading: "Submitted February 28, 2022",
		text: "Prospective students joined the Yale Chemistry community on Feb. 10 – 11 to learn about the research program and campus life at the much anticipated ‘Visiting Days’ event. See more at <a href=\"https://www.yale.edu\">Yale</a>.",
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

	render: (args) =>
		`<div data-global-theme="${args.globalTheme}">
			<ycl-text-with-image theme="${args.theme}" width="${args.width}" position="${args.position}" vertical-align="${args.verticalAlign}" image-style="${args.imageStyle}" focus="${args.focus}">
				<img slot="image" src="${placeholder(900, 600)}" alt="Students touring a chemistry lab">
				${args.caption ? `<p slot="caption">${args.caption}</p>` : ""}
				${args.overline ? `<p slot="overline">${args.overline}</p>` : ""}
				<h2 slot="heading">${args.heading}</h2>
				${args.subheading ? `<p slot="subheading">${args.subheading}</p>` : ""}
				${args.linkContent ? `<text-link slot="ctas" href="https://www.yale.edu">${args.linkContent}</text-link>` : ""}
				${args.linkTwoContent ? `<text-link slot="ctas" href="https://www.yale.edu">${args.linkTwoContent}</text-link>` : ""}
				<p>${args.text}</p>
			</ycl-text-with-image>
		</div>`,
};

export const Default = {};

export const ImageRight = {
	args: { position: "image-right", focus: "image" },
};

export const Themed = {
	args: { theme: "one" },
};

export const Offset = {
	args: { imageStyle: "offset", verticalAlign: "middle" },
};
