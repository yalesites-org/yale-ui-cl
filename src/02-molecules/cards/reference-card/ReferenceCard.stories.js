import "./ReferenceCard";
import "../../../01-atoms/headings/Heading";
import "../../../01-atoms/cta/Cta";
import "../../../01-atoms/image/ResponsiveImage";
import "../../../01-atoms/date-time/DateTime";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme, placeholder } from "../../../../.storybook/story-helpers.js";

const collectionStyle = (layout) => layout === "grid"
	? "list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr)); gap: var(--size-spacing-8);"
	: "list-style: none; padding: 0; display: grid; gap: var(--size-spacing-8);";

// The card's attributes come from args; its content defaults to the args' slot text too.
const card = (args, { heading, snippet, overline, image = placeholder(600, 400), extra = "" } = args) => {
	const slots = [
		args.withImage ? `<ycl-image slot="image"><img src="${image}" alt=""></ycl-image>` : "",
		heading ? `<ycl-heading level="3" slot="heading">${heading}</ycl-heading>` : "",
		overline ? `<ycl-date-time slot="overline" start="${overline}" format="date" time-zone="America/New_York">${overline}</ycl-date-time>` : "",
		snippet ? `<p>${snippet}</p>` : "",
		extra,
	].filter(Boolean);
	return `
	<li>
		<ycl-reference-card${attrs({
			href: args.href,
			layout: args.layout,
			featured: args.featured,
			overlay: args.overlay,
			source: args.source,
		})}>
			${slots.join("\n\t\t\t")}
		</ycl-reference-card>
	</li>`;
};

const collection = (args, cards) => withGlobalTheme(args.globalTheme, `<ul style="${collectionStyle(args.layout)}">
				${cards}
			</ul>`);

export default {
	title: "Molecules/Cards/Reference Card",
	component: "ycl-reference-card",
	argTypes: {
		href: attributeArg("Card link. The whole card is clickable; without it the card is not a link.", { control: "text" }),
		overlay: attributeArg("Label shown over the card image (e.g. \"Featured\"). Omitted when empty.", {
			name: "Overlay text",
			control: "text",
		}),
		layout: attributeArg("The collection the card sits in, which changes its layout. Defaults to grid. The story shows three cards, or one for single.", {
			name: "Collection Type",
			control: "select",
			options: ["grid", "list", "condensed", "single"],
		}),
		featured: attributeArg("Featured (larger) card style.", { control: "boolean" }),
		source: attributeArg("The kind of content the card references; profiles and resources crop their image differently.", {
			control: "select",
			options: ["none", "profile", "resource"],
			mapping: { none: undefined },
		}),
		withImage: slotArg("Card image (slot=\"image\").", { name: "With Image", control: "boolean" }),
		heading: slotArg("Card heading (slot=\"heading\"). Omitted when empty.", { control: "text" }),
		overline: slotArg("Date above the heading (slot=\"overline\"), as an ISO 8601 date-time. Omitted when empty.", {
			name: "Overline (date, ISO 8601)",
			control: "text",
		}),
		snippet: slotArg("Card text (default slot). Omitted when empty.", { control: "text" }),
		otherSlots: slotArg("Also available: slot=\"categories\", \"eyebrow\", \"prefix\", \"pronouns\", \"subheading\", \"tags\" and \"ctas\". See the Profile and Event With Ctas stories.", {
			control: false,
		}),
		globalTheme: globalThemeArgType,
	},
	args: {
		heading: "Wu Tsai Institute postdocs bridge disciplines in the study of cognition",
		snippet: "The Wu Tsai Institute's first postdoc cohort will study human cognition, working at the intersections of different fields of research.",
		overline: "2022-03-30T12:00:00-04:00",
		href: "https://www.yale.edu",
		overlay: "",
		layout: "grid",
		featured: true,
		source: "none",
		withImage: true,
		globalTheme: "one",
	},

	render: (args) => {
		if (args.layout === "single") return collection(args, card(args));
		return collection(args, [
			card(args),
			card(args, {
				heading: "Admitted students envision themselves as Yale chemists",
				snippet: "Prospective students joined the Yale Chemistry community to learn about the research program and campus life.",
				overline: "2022-02-28T12:00:00-05:00",
			}),
			card(args, {
				heading: "New exhibition opens at the Yale University Art Gallery",
				snippet: "The exhibition brings together more than 100 works from the gallery's collection.",
				overline: "2022-01-12T12:00:00-05:00",
			}),
		].join(""));
	},
};

export const Default = {};

export const Profile = {
	args: {
		source: "profile",
	},
	parameters: {
		docs: {
			description: {
				story: "A profile card fills the pronouns slot and repeats the subheading slot. Controls only fill the heading, date and text slots, so they cannot build this markup.",
			},
		},
	},
	render: (args) => collection(args, card(args, {
		heading: "Person Namertone",
		snippet: "Subtitle/Lede",
		image: placeholder(400, 400),
		extra: `<span slot="pronouns">They/Them</span>
			<span slot="subheading">Professional Title</span>
			<span slot="subheading">Professor of Subject</span>`,
	})),
};

export const EventWithCtas = {
	parameters: {
		docs: {
			description: {
				story: "An event card with date and time subheadings and buttons in the ctas slot. Controls only fill the heading, date and text slots, so they cannot build this markup.",
			},
		},
	},
	render: (args) => collection(args, card(args, {
		heading: "Yale Symphony Orchestra: Fall Concert",
		snippet: "Join the Yale Symphony Orchestra for an evening of music in Woolsey Hall.",
		extra: `<ycl-date-time slot="subheading" start="2022-10-14T19:30:00-04:00" format="day__full" time-zone="America/New_York"></ycl-date-time>
			<ycl-date-time slot="subheading" start="2022-10-14T19:30:00-04:00" format="time" time-zone="America/New_York"></ycl-date-time>
			<span slot="subheading">In-person</span>
			<cta-link slot="ctas" class="filled" href="https://www.yale.edu">Buy Tickets</cta-link>
			<cta-link slot="ctas" class="outline" href="https://www.yale.edu">Add to Calendar</cta-link>`,
	})),
};
