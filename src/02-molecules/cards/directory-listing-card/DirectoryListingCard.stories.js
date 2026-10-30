import "./DirectoryListingCard";
import "../../../01-atoms/headings/Heading";
import "../../../01-atoms/text-link/Link";
import "../../../01-atoms/image/ResponsiveImage";
import { attrs, attributeArg, slotArg, placeholder } from "../../../../.storybook/story-helpers.js";

const textSlot = (description) => slotArg(`${description} Omitted when empty.`, { control: "text" });

export default {
	title: "Molecules/Cards/Directory Listing Card",
	component: "ycl-directory-listing-card",
	argTypes: {
		href: attributeArg("Profile link. The whole card is clickable; without it the card is not a link.", { control: "text" }),
		layout: attributeArg("The collection the card sits in, which changes its layout.", {
			name: "Collection Type",
			control: "select",
			options: ["profile-directory", "directory-listing"],
		}),
		featured: attributeArg("Featured (larger) card style.", { control: "boolean" }),
		image: slotArg("Portrait (slot=\"image\"), usually a ycl-image.", { control: false }),
		overline: textSlot("Text above the name (slot=\"overline\")."),
		heading: textSlot("Name (slot=\"heading\")."),
		subheading: textSlot("Title (slot=\"subheading\")."),
		snippet: textSlot("Text (default slot)."),
		email: textSlot("Email address, rendered as a mailto link (slot=\"email\")."),
		phone: textSlot("Phone number, rendered as a tel link (slot=\"phone\")."),
	},
	args: {
		overline: "Humanities",
		heading: "Person Namerton",
		subheading: "Professional Title and Professor of Subject",
		snippet: "Subtitle/Lede",
		email: "person.name@yale.edu",
		phone: "203.565.7777",
		href: "#",
		layout: "profile-directory",
		featured: true,
	},

	render: (args) => {
		const slots = [
			`<ycl-image slot="image"><img src="${placeholder(400, 400)}" alt=""></ycl-image>`,
			args.overline ? `<span slot="overline">${args.overline}</span>` : "",
			args.heading ? `<ycl-heading level="3" slot="heading">${args.heading}</ycl-heading>` : "",
			args.subheading ? `<span slot="subheading">${args.subheading}</span>` : "",
			args.snippet ? `<p>${args.snippet}</p>` : "",
			args.email ? `<text-link slot="email" href="mailto:${args.email}">Email</text-link>` : "",
			args.phone ? `<text-link slot="phone" href="tel:${args.phone.replace(/[^\d+]/g, "")}">${args.phone}</text-link>` : "",
		].filter(Boolean);
		return `<ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: var(--size-spacing-8);">
			<li>
				<ycl-directory-listing-card${attrs({ href: args.href, layout: args.layout, featured: args.featured })}>
					${slots.join("\n\t\t\t\t\t")}
				</ycl-directory-listing-card>
			</li>
		</ul>`;
	},
};

export const Default = {};
