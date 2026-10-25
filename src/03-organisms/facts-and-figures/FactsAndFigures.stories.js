import "./FactsAndFigures";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/text-link/Link";
import "../../01-atoms/icons/Icon";
import "../../01-atoms/image/ResponsiveImage";
import backgroundImage from "../../assets/avif-test-image.avif";

// Decorative, so unlabelled; an inline SVG can also go in the icon slot.
const icon = (name) => `<ycl-icon slot="icon" name="${name}"></ycl-icon>`;

// Alignment, presentation and padded are set once on ycl-facts-and-figures, which copies them
// onto every stat. Stats have no theme of their own inside the group: the group's Theme colours
// them. The first stat takes the Statistic and Content controls.
const stats = (args) => [
	{ stat: args.stat, content: args.content, icon: "hand-holding-dollar-solid" },
	{ stat: "6:1", content: "Student to faculty ratio", icon: "chalkboard-user-solid" },
	{ stat: "14", content: "Residential colleges", icon: "building-columns-solid" },
].map((item) => `
	<ycl-facts-and-figures-item>
		${args.withIcon ? icon(item.icon) : ""}
		<span slot="stat">${item.stat}</span>
		${item.content}
	</ycl-facts-and-figures-item>`).join("");

export default {
	title: "Organisms/Facts and Figures",
	component: "ycl-facts-and-figures",
	argTypes: {
		heading: { name: "Group Heading", control: "text" },
		intro: { name: "Group Intro Text", control: "text" },
		linkText: { name: "Group Link Text", control: "text" },
		linkUrl: { name: "Group Link URL", control: "text" },
		withImage: { name: "Group Background Image", control: "boolean" },
		theme: {
			name: "Theme",
			type: "select",
			options: ["one", "two", "three", "four", "five", "six"],
		},
		stat: { name: "Statistic", control: "text" },
		content: { control: "text" },
		alignment: {
			type: "select",
			options: ["center", "left"],
		},
		presentation: {
			name: "Presentation Style",
			type: "select",
			options: ["basic", "plain"],
		},
		withIcon: { name: "With Icon", control: "boolean" },
		// Stats have no background inside the group, so they drop their horizontal padding unless padded.
		padded: { name: "Padded", control: "boolean" },
		globalTheme: {
			name: "Site Global Theme",
			type: "select",
			options: ["one", "two", "three", "four", "five", "six"],
		},
	},
	args: {
		heading: "Facts and Figures",
		intro: "A few numbers that describe the undergraduate experience.",
		linkText: "Explore more facts",
		linkUrl: "https://www.yale.edu",
		withImage: false,
		theme: "one",
		stat: "$52,000",
		content: "Annual grant of Undergraduate students",
		alignment: "center",
		presentation: "basic",
		withIcon: false,
		padded: false,
		globalTheme: "one",
	},

	render: (args) =>
		`<div data-global-theme="${args.globalTheme}">
			<ycl-facts-and-figures theme="${args.theme}" alignment="${args.alignment}" presentation="${args.presentation}" ${args.padded ? "padded" : ""}>
				${args.heading ? `<ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : ""}
				${args.intro ? `<p slot="intro">${args.intro}</p>` : ""}
				${args.withImage ? `<ycl-image slot="image"><img src="${backgroundImage}" alt=""></ycl-image>` : ""}
				${stats(args)}
				${args.linkText && args.linkUrl ? `<ycl-text-link slot="link" href="${args.linkUrl}">${args.linkText}</ycl-text-link>` : ""}
			</ycl-facts-and-figures>
		</div>`,
};

export const Default = {};

export const LeftWithIcon = {
	args: { alignment: "left", withIcon: true, theme: "three" },
};

export const WithBackgroundImage = {
	args: { withImage: true, theme: "two" },
};
