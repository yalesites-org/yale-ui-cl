import "./ReferenceCard";
import "../../../01-atoms/cta/Cta";
import "../../../01-atoms/image/ResponsiveImage";
import "../../../01-atoms/date-time/DateTime";

// Self-contained placeholder so the stories don't depend on an image host.
const placeholder = (w, h) => `data:image/svg+xml,${encodeURIComponent(
	`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#dddddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(h / 8)}" fill="#4a4a4a">${w} x ${h}</text></svg>`
)}`;

const collectionStyle = (layout) => layout === "grid"
	? "list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr)); gap: var(--size-spacing-8);"
	: "list-style: none; padding: 0; display: grid; gap: var(--size-spacing-8);";

const card = (args, { heading, snippet, overline, image = placeholder(600, 400), extra = "" }) => `
	<li>
		<ycl-reference-card href="${args.href}" layout="${args.layout}" ${args.featured ? "featured" : ""} ${args.overlay ? `overlay="${args.overlay}"` : ""} ${args.source ? `source="${args.source}"` : ""}>
			${args.withImage ? `<ycl-image slot="image"><img src="${image}" alt=""></ycl-image>` : ""}
			<h3 slot="heading">${heading}</h3>
			${overline ? `<ycl-date-time slot="overline" start="${overline}" format="date" time-zone="America/New_York">${overline}</ycl-date-time>` : ""}
			${snippet ? `<p>${snippet}</p>` : ""}
			${extra}
		</ycl-reference-card>
	</li>`;

export default {
	title: "Reference Card",
	component: "ycl-reference-card",
	argTypes: {
		heading: { control: "text" },
		snippet: { control: "text" },
		overline: { name: "Overline (date, ISO 8601)", control: "text" },
		href: { control: "text" },
		overlay: { name: "Overlay text", control: "text" },
		layout: {
			name: "Collection Type",
			type: "select",
			options: ["grid", "list", "condensed", "single"],
		},
		featured: { control: "boolean" },
		withImage: { name: "With Image", control: "boolean" },
		globalTheme: {
			name: "Site Global Theme",
			type: "select",
			options: ["one", "two", "three", "four", "five", "six"],
		},
	},
	args: {
		heading: "Wu Tsai Institute postdocs bridge disciplines in the study of cognition",
		snippet: "The Wu Tsai Institute's first postdoc cohort will study human cognition, working at the intersections of different fields of research.",
		overline: "2022-03-30T12:00:00-04:00",
		href: "https://www.yale.edu",
		overlay: "",
		layout: "grid",
		featured: true,
		withImage: true,
		globalTheme: "one",
	},

	render: (args) =>
		`<div data-global-theme="${args.globalTheme}">
			<ul style="${collectionStyle(args.layout)}">
				${card(args, args)}
				${args.layout === "single" ? "" : card(args, {
					heading: "Admitted students envision themselves as Yale chemists",
					snippet: "Prospective students joined the Yale Chemistry community to learn about the research program and campus life.",
					overline: "2022-02-28T12:00:00-05:00",
				})}
				${args.layout === "single" ? "" : card(args, {
					heading: "New exhibition opens at the Yale University Art Gallery",
					snippet: "The exhibition brings together more than 100 works from the gallery's collection.",
					overline: "2022-01-12T12:00:00-05:00",
				})}
			</ul>
		</div>`,
};

export const Default = {};

export const NotFeatured = {
	args: { featured: false },
};

export const List = {
	args: { layout: "list" },
};

export const Condensed = {
	args: { layout: "condensed", withImage: false },
};

export const Single = {
	args: { layout: "single" },
};

export const WithOverlay = {
	args: { overlay: "Featured" },
};

export const Profile = {
	args: {
		source: "profile",
	},
	render: (args) =>
		`<div data-global-theme="${args.globalTheme}">
			<ul style="${collectionStyle(args.layout)}">
				${card(args, {
					heading: "Person Namertone",
					snippet: "Subtitle/Lede",
					image: placeholder(400, 400),
					extra: `<span slot="pronouns">They/Them</span>
						<span slot="subheading">Professional Title</span>
						<span slot="subheading">Professor of Subject</span>`,
				})}
			</ul>
		</div>`,
};

export const EventWithCtas = {
	render: (args) =>
		`<div data-global-theme="${args.globalTheme}">
			<ul style="${collectionStyle(args.layout)}">
				${card(args, {
					heading: "Yale Symphony Orchestra: Fall Concert",
					snippet: "Join the Yale Symphony Orchestra for an evening of music in Woolsey Hall.",
					extra: `<ycl-date-time slot="subheading" start="2022-10-14T19:30:00-04:00" format="day__full" time-zone="America/New_York"></ycl-date-time>
						<ycl-date-time slot="subheading" start="2022-10-14T19:30:00-04:00" format="time" time-zone="America/New_York"></ycl-date-time>
						<span slot="subheading">In-person</span>
						<cta-link slot="ctas" class="filled" href="https://www.yale.edu">Buy Tickets</cta-link>
						<cta-link slot="ctas" class="outline" href="https://www.yale.edu">Add to Calendar</cta-link>`,
				})}
			</ul>
		</div>`,
};
