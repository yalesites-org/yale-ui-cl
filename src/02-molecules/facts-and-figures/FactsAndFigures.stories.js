import "./FactsAndFigures";

// A simple decorative star; any inline SVG can go in the icon slot.
const starIcon = `<svg slot="icon" viewBox="0 0 24 24" width="48" height="48" aria-hidden="true" focusable="false"><polygon points="12,2 14.9,8.6 22,9.3 16.6,14 18.2,21 12,17.3 5.8,21 7.4,14 2,9.3 9.1,8.6"/></svg>`;

export default {
	title: "Facts and Figures",
	component: "ycl-facts-and-figures",
	argTypes: {
		stat: { name: "Statistic", control: "text" },
		content: { control: "text" },
		theme: {
			name: "Component Theme",
			type: "select",
			options: ["default", "one", "two", "three", "four", "five"],
		},
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
		globalTheme: {
			name: "Site Global Theme",
			type: "select",
			options: ["one", "two", "three", "four", "five", "six"],
		},
	},
	args: {
		stat: "$52,000",
		content: "Annual grant of Undergraduate students",
		theme: "one",
		alignment: "center",
		presentation: "basic",
		withIcon: false,
		globalTheme: "one",
	},

	render: (args) =>
		`<div data-global-theme="${args.globalTheme}" style="max-width: 24rem;">
			<ycl-facts-and-figures theme="${args.theme}" alignment="${args.alignment}" presentation="${args.presentation}" padded>
				${args.withIcon ? starIcon : ""}
				<span slot="stat">${args.stat}</span>
				${args.content}
			</ycl-facts-and-figures>
		</div>`,
};

export const Default = {};

export const LeftWithIcon = {
	args: { alignment: "left", withIcon: true, theme: "three" },
};

export const Group = {
	render: (args) =>
		`<div data-global-theme="${args.globalTheme}">
			<ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: var(--size-spacing-6);">
				<li><ycl-facts-and-figures theme="${args.theme}" alignment="${args.alignment}" padded><span slot="stat">$52,000</span>Annual grant of Undergraduate students</ycl-facts-and-figures></li>
				<li><ycl-facts-and-figures theme="${args.theme}" alignment="${args.alignment}" padded><span slot="stat">6:1</span>Student to faculty ratio</ycl-facts-and-figures></li>
				<li><ycl-facts-and-figures theme="${args.theme}" alignment="${args.alignment}" padded>${starIcon}<span slot="stat">14</span>Residential colleges</ycl-facts-and-figures></li>
			</ul>
		</div>`,
};
