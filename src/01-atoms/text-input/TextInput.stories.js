import {
	TextInput
} from "./TextInput";
export default {
	title: 'Text Input',
	component: 'text-input',
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
		type: {
			control: 'select',
			options: ['text', 'date', 'datetime-local', 'tel', 'number', 'email', 'radio']
		}
	},
	args: {
		label: 'Input with Error',
		instructions: 'This is an example instruction.',
		errors: 'This is an example error',
		required: false,
	},

	render: (args) =>
		`<text-input class="${args.required}">
		<span slot="label">${args.label}</span>
		<span slot="instructions">This is an example instruction</span>
		<span slot="errors">This is an error.</span>
	</text-input>`,
};

export const Example = {
	args: {
        errors: "",
        label: "Name",
        type: "date"
    },
	render:(args) =>
		`<text-input type="${args.type}" placeholder="${args.placeholder}" autocomplete="${args.autocomplete}" class="${args.required}">
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
        required: false,
        type: 'text'
    },
    render:args => `<text-input type="${args.type}" placeholder="${args.placeholder}" autocomplete="${args.autocomplete}" class="${args.required}">
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
        required: true,
        type: 'text'
    },
    render:args => `<text-input type="${args.type}" placeholder="${args.placeholder}" autocomplete="${args.autocomplete}" class="${args.required}">
        <span slot="label">${args.label}</span>
        <span slot="instructions">${args.instructions}</span>
        <span slot="errors">${args.errors}</span>
    </text-input>`
};
