import {
	SelectInput
} from "./SelectInput";
export default {
	title: 'Select Input',
	component: 'select-input',
	argTypes: {
		label: {
			control: 'text'
		},
		required: {
			control: 'boolean',
			mapping: {
				true: "required",
			},
		},
		
		autocomplete: {
			control: 'text',
		},
		
		placeholder: {
			control: 'text',
		},
		
		instructions: {
			control: 'text'
		},
		errors: {
			control: 'text'
		},
	},
	args: {
		label: 'Example Select',
		instructions: 'This is an example instruction.',
		errors: 'This is an example error',
		required: false,
	},

	render: (args) =>
		`<select-input class="${args.required}">
		<span slot="label">${args.label}</span>
		<span slot="instructions">This is an example instruction</span>
		<span slot="errors">This is an error.</span>
	</select-input>`,
};

export const Example = {
	args: {
        errors: "",
        label: "Name"
    },
	render:(args) =>
		`<text-input placeholder="${args.placeholder}" autocomplete="${args.autocomplete}" class="${args.required}">
		<span slot="label">${args.label}</span>
		<span slot="instructions">${args.instructions}</span>
		<span slot="errors">${args.errors}</span>
	</text-input>`
};

export const WithError = {
    args: {
        label: "Yale HomePage",
        instructions: "This is an example instruction.",
        errors: "This has an error.",
        required: false
    },
    render:args => `<text-input placeholder="${args.placeholder}" autocomplete="${args.autocomplete}" class="${args.required}">
        <span slot="label">${args.label}</span>
        <span slot="instructions">${args.instructions}</span>
        <span slot="errors">${args.errors}</span>
    </text-input>`
};

export const Required = {
    args: {
        label: "Yale HomePage",
        instructions: "This is an example instruction.",
        errors: "",
        required: true
    },
    render:args => `<text-input placeholder="${args.placeholder}" autocomplete="${args.autocomplete}" class="${args.required}">
        <span slot="label">${args.label}</span>
        <span slot="instructions">${args.instructions}</span>
        <span slot="errors">${args.errors}</span>
    </text-input>`
};
