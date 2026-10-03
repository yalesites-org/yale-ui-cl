import "./DirectoryListingCard";
import "../../../01-atoms/text-link/Link";
import "../../../01-atoms/image/ResponsiveImage";

// Self-contained placeholder so the stories don't depend on an image host.
const placeholder = (w, h) => `data:image/svg+xml,${encodeURIComponent(
	`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#dddddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(h / 8)}" fill="#4a4a4a">${w} x ${h}</text></svg>`
)}`;

export default {
	title: "Directory Listing Card",
	component: "ycl-directory-listing-card",
	argTypes: {
		overline: { control: "text" },
		heading: { control: "text" },
		subheading: { control: "text" },
		snippet: { control: "text" },
		email: { control: "text" },
		phone: { control: "text" },
		href: { control: "text" },
		layout: {
			name: "Collection Type",
			type: "select",
			options: ["profile-directory", "directory-listing"],
		},
		featured: { control: "boolean" },
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

	render: (args) =>
		`<ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: var(--size-spacing-8);">
			<li>
				<ycl-directory-listing-card href="${args.href}" layout="${args.layout}" ${args.featured ? "featured" : ""}>
					<ycl-image slot="image"><img src="${placeholder(400, 400)}" alt=""></ycl-image>
					<span slot="overline">${args.overline}</span>
					<h3 slot="heading">${args.heading}</h3>
					<span slot="subheading">${args.subheading}</span>
					<p>${args.snippet}</p>
					${args.email ? `<text-link slot="email" href="mailto:${args.email}">Email</text-link>` : ""}
					${args.phone ? `<text-link slot="phone" href="tel:${args.phone.replace(/[^\d+]/g, "")}">${args.phone}</text-link>` : ""}
				</ycl-directory-listing-card>
			</li>
		</ul>`,
};

export const Default = {};

export const NotFeatured = {
	args: { featured: false },
};

export const DirectoryListing = {
	args: { layout: "directory-listing" },
};
