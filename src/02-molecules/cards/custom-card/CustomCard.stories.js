import "./CustomCard";

// Self-contained placeholder so the stories don't depend on an image host.
const placeholder = (w, h) => `data:image/svg+xml,${encodeURIComponent(
	`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#dddddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(h / 8)}" fill="#4a4a4a">${w} x ${h}</text></svg>`
)}`;

const card = (args, heading, snippet) => `
	<li>
		<ycl-custom-card href="${args.href}" ${args.featured ? "featured" : ""}>
			${args.withImage ? `<img slot="image" src="${placeholder(600, 400)}" alt="">` : ""}
			<h3 slot="heading">${heading}</h3>
			<p>${snippet}</p>
		</ycl-custom-card>
	</li>`;

export default {
	title: "Custom Card",
	component: "ycl-custom-card",
	argTypes: {
		heading: { control: "text" },
		snippet: { control: "text" },
		href: { control: "text" },
		featured: { control: "boolean" },
		withImage: { name: "With Image", control: "boolean" },
		globalTheme: {
			name: "Site Global Theme",
			type: "select",
			options: ["one", "two", "three", "four", "five", "six"],
		},
	},
	args: {
		heading: "Card Title",
		snippet: "Content goes here.",
		href: "https://www.yale.edu",
		featured: true,
		withImage: true,
		globalTheme: "one",
	},

	render: (args) =>
		`<div data-global-theme="${args.globalTheme}">
			<ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr)); gap: var(--size-spacing-8);">
				${card(args, args.heading, args.snippet)}
				${card(args, "Undergraduate Research", "Find opportunities to work with faculty on original research.")}
				${card(args, "Visiting Campus", "Plan a visit, take a tour, and explore New Haven.")}
			</ul>
		</div>`,
};

export const Default = {};

export const WithoutImage = {
	args: { withImage: false, featured: false },
};
