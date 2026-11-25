import "./CardCollection";
import "../../02-molecules/cards/content-card/ContentCard";
import "../../02-molecules/cards/custom-card/CustomCard";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/image/ResponsiveImage";
import "../../01-atoms/date-time/DateTime";
import { attrs, attributeArg, slotArg, placeholder } from "../../../.storybook/story-helpers.js";

const posts = [
	["2024-03-30T12:00:00-04:00", "Wu Tsai Institute postdocs bridge disciplines in the study of cognition", "The institute's first postdoc cohort works where different fields of research meet."],
	["2024-04-12T12:00:00-04:00", "Yale researchers map how forests recover after fire", "A long-term study follows regrowth across three decades of burn sites."],
	["2024-05-02T12:00:00-04:00", "New course pairs computer science with the humanities", "Students build tools to read and compare thousands of historical letters."],
];

const contentCard = ([date, heading, snippet]) => `
	<ycl-content-card href="#">
		<ycl-image slot="image"><img src="${placeholder(600, 400)}" alt=""></ycl-image>
		<ycl-heading level="3" slot="heading">${heading}</ycl-heading>
		<ycl-date-time slot="overline" start="${date}" format="date" time-zone="America/New_York">${date}</ycl-date-time>
		<p>${snippet}</p>
	</ycl-content-card>`;

const customCard = ([, heading, snippet]) => `
	<ycl-custom-card href="#">
		<ycl-image slot="image" ratio="3x2"><img src="${placeholder(600, 400)}" alt=""></ycl-image>
		<ycl-heading level="3" slot="heading">${heading}</ycl-heading>
		<p>${snippet}</p>
	</ycl-custom-card>`;

export default {
	title: "Organisms/Card Collection",
	component: "ycl-card-collection",
	argTypes: {
		layout: attributeArg("Grid of up to three columns (one on narrow screens), or a single-column list. Content cards without their own layout follow it.", {
			control: "select",
			options: ["grid", "list"],
		}),
		level: attributeArg("Heading level (1 to 6). Pick the one that fits the page outline; defaults to 2.", {
			control: "select",
			options: ["1", "2", "3", "4", "5", "6"],
		}),
		linkHref: attributeArg("link-href: URL of the \"view all\" link. The link shows only when it has an href and link text.", { name: "Link href", control: "text" }),
		heading: slotArg("Heading (slot=\"heading\"). The whole header is omitted when heading, intro and link are all empty.", { control: "text" }),
		text: slotArg("Intro text (slot=\"text\"). Omitted when empty.", { control: "text" }),
		link: slotArg("Link text (slot=\"link\"), for example \"View all\". Omitted when empty.", { control: "text" }),
		cards: slotArg("ycl-content-card or ycl-custom-card elements in the default slot.", { control: false }),
		cardType: slotArg("Which card the story fills the collection with.", {
			name: "Card type",
			control: "select",
			options: ["content", "custom"],
		}),
	},
	args: {
		layout: "grid",
		level: "2",
		linkHref: "#",
		heading: "Latest News",
		text: "Stories from across the university.",
		link: "View all",
		cardType: "content",
	},
	render: (args) => `
		<ycl-card-collection${attrs({ layout: args.layout, level: args.level, "link-href": args.linkHref })}>
			${args.heading ? `<span slot="heading">${args.heading}</span>` : ""}
			${args.text ? `<span slot="text">${args.text}</span>` : ""}
			${args.link ? `<span slot="link">${args.link}</span>` : ""}
			${posts.map(args.cardType === "custom" ? customCard : contentCard).join("")}
		</ycl-card-collection>`,
};

export const Grid = {};

export const List = {
	args: { layout: "list" },
};

export const CustomCards = {
	args: { heading: "Explore Yale", text: "", cardType: "custom" },
};

export const WithoutHeader = {
	args: { heading: "", text: "", link: "" },
};
