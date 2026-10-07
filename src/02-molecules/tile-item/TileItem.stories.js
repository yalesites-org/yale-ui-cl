import "./TileItem";
import "../../01-atoms/icons/Icon";
import "../../01-atoms/image/ResponsiveImage";

// Self-contained placeholder so the stories don't depend on an image host.
const placeholder = (w, h) => `data:image/svg+xml,${encodeURIComponent(
	`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#dddddd"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(h / 8)}" fill="#4a4a4a">${w} x ${h}</text></svg>`
)}`;

// Decorative, so unlabelled; an inline SVG can also go in the icon slot.
const icon = `<ycl-icon slot="icon" name="lightbulb-solid"></ycl-icon>`;

const tile = (args, heading) => `
	<li>
		<ycl-tile-item theme="${args.theme}" alignment="${args.alignment}" vertical-alignment="${args.verticalAlignment}" ${args.href ? `href="${args.href}"` : ""} ${args.animated ? "animated" : ""} style="min-height: 18rem;">
			${args.presentation === "icon" ? icon : ""}
			${args.presentation === "heading" ? `<span slot="heading">${heading}</span>` : ""}
			${args.withImage ? `<ycl-image slot="image"><img src="${placeholder(600, 600)}" alt=""></ycl-image>` : ""}
			${args.content}
		</ycl-tile-item>
	</li>`;

export default {
	title: "Molecules/Tile Item",
	component: "ycl-tile-item",
	argTypes: {
		heading: { control: "text" },
		content: { control: "text" },
		href: { name: "Content Link", control: "text" },
		presentation: {
			name: "Presentation Style",
			type: "select",
			options: ["heading", "icon", "text-only"],
		},
		alignment: {
			type: "select",
			options: ["left", "center", "right"],
		},
		verticalAlignment: {
			name: "Vertical Alignment",
			type: "select",
			options: ["top", "bottom"],
		},
		theme: {
			name: "Component Theme",
			type: "select",
			options: ["one", "two", "three", "four", "five", "six"],
		},
		withImage: { name: "With Image", control: "boolean" },
		animated: { name: "With Animation", control: "boolean" },
		globalTheme: {
			name: "Site Global Theme",
			type: "select",
			options: ["one", "two", "three", "four", "five", "six"],
		},
	},
	args: {
		heading: "01",
		content: "This is a tile item with content!",
		href: "https://www.yale.edu",
		presentation: "heading",
		alignment: "left",
		verticalAlignment: "top",
		theme: "one",
		withImage: false,
		animated: false,
		globalTheme: "one",
	},

	render: (args) =>
		`<div data-global-theme="${args.globalTheme}">
			<ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); gap: var(--size-spacing-6);">
				${tile(args, args.heading)}
				${tile(args, "02")}
				${tile(args, "03")}
			</ul>
		</div>`,
};

export const Default = {};

export const Icon = {
	args: { presentation: "icon", theme: "three", alignment: "center" },
};

export const TextOnlyBottom = {
	args: { presentation: "text-only", verticalAlignment: "bottom", theme: "two", href: "" },
};

export const WithImage = {
	args: { withImage: true, animated: true },
};
