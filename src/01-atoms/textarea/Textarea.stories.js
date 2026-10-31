import "./Textarea";
export default {
	title: "Atoms/Textarea",
	component: "ycl-text-area",
	argTypes: {
		label: { control: "text" },
		required: {
			control: "boolean",
			mapping: { true: "required", false: "" },
		},
		placeholder: { control: "text" },
		rows: { control: "number" },
		instructions: { control: "text" },
		errors: { control: "text" },
	},
	args: {
		label: "Message",
		placeholder: "",
		rows: 5,
		instructions: "This is an example instruction.",
		errors: "",
		required: false,
	},
	render: (args) =>
		`<ycl-text-area placeholder="${args.placeholder}" rows="${args.rows}" ${args.required}>
		<span slot="label">${args.label}</span>
		<span slot="instructions">${args.instructions}</span>
		<span slot="errors">${args.errors}</span>
	</ycl-text-area>`,
};

export const Example = {};

export const WithError = {
	args: {
		errors: "This has an error.",
	},
};

export const Required = {
	args: {
		required: true,
	},
};
