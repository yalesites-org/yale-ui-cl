import "./SelectInput";
export default {
	title: 'Atoms/Select Input',
	component: 'ycl-select-input',
	argTypes: {
		label: {
			control: 'text'
		},
		required: {
			control: 'boolean',
			mapping: {
				true: "required",
				false: "",
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
		`<ycl-select-input class="${args.required}"> 
		<span slot="label">${args.label}</span>
		<span slot="instructions">This is an example instruction</span>
		<span slot="errors">This is an error.</span>
	</ycl-select-input>`
};

export const Example = {
	args: {
        errors: "",
        label: "Name"
    },
	render:(args) =>
		`<ycl-select-input placeholder="${args.placeholder}" autocomplete="${args.autocomplete}" class="${args.required}">
		<span slot="label">${args.label}</span>
		<span slot="instructions">${args.instructions}</span>
		<span slot="errors">${args.errors}</span>
		<option>This is an option</option>
		<option>This is another option</option>
	</ycl-select-input>`,
};

export const WithError = {
    args: {
        label: "Yale HomePage",
        instructions: "This is an example instruction.",
        errors: "This has an error.",
        required: false,
    },
    render:args => `<ycl-select-input placeholder="${args.placeholder}" autocomplete="${args.autocomplete}" class="${args.required}">
        <span slot="label">${args.label}</span>
        <span slot="instructions">${args.instructions}</span>
        <span slot="errors">${args.errors}</span>
		<option>Example Value 1</option>
		<option>Example Value 2</option>
    </ycl-select-input>`
};

export const RequiredWithGroups = {
    args: {
        label: "Yale HomePage",
        instructions: "This is an example instruction.",
        errors: "",
        required: true
    },
    render:args => `<ycl-select-input placeholder="${args.placeholder}" autocomplete="${args.autocomplete}" class="${args.required}">
        <span slot="label">${args.label}</span>
        <span slot="instructions">${args.instructions}</span>
        <span slot="errors">${args.errors}</span>
    	<optgroup label="Example 1">
    	<option>This is one option</option>
    	<option>This is another option!</option>
    	</optgroup>
    </ycl-select-input>`
};
