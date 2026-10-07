import "./FactsAndFigures";
import "../../01-atoms/icons/Icon";

// Decorative, so unlabelled; an inline SVG can also go in the icon slot.
const icon = (name) => `<ycl-icon slot="icon" name="${name}"></ycl-icon>`;

export default {
	title: "Molecules/Facts and Figures",
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
				${args.withIcon ? icon("hand-holding-dollar-solid") : ""}
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
				<li><ycl-facts-and-figures theme="${args.theme}" alignment="${args.alignment}" padded>${icon("building-columns-solid")}<span slot="stat">14</span>Residential colleges</ycl-facts-and-figures></li>
			</ul>
		</div>`,
};
