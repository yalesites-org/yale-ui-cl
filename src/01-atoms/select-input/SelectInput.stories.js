import "./SelectInput";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

const options = ['This is an option', 'This is another option', 'This is a third option'];

export default {
	title: 'Atoms/Select Input',
	component: 'select-input',
	argTypes: {
		name: attributeArg('Name the value is submitted under with its form.', { control: 'text' }),
		value: attributeArg('Selected value (the text or value of one of the options).', { control: 'text' }),
		placeholder: attributeArg('Passed to the inner select; browsers do not show a placeholder on selects.', { control: 'text' }),
		autocomplete: attributeArg('Autocomplete hint passed to the inner select.', { control: 'text' }),
		required: attributeArg('Adds the "required" class: the field is required and its label is marked required.', { control: 'boolean' }),
		disabled: attributeArg('Disables the field.', { control: 'boolean' }),
		label: slotArg('Field label (slot="label").', { control: 'text' }),
		instructions: slotArg('Help text under the field (slot="instructions"). Omitted when empty.', { control: 'text' }),
		errors: slotArg('Error message (slot="errors"); any content marks the field invalid. Omitted when empty.', { control: 'text' }),
		grouped: slotArg('Wrap the `<option>`s in an `<optgroup>`. Options and optgroups are children of the element and move into the inner select.', {
			name: 'Option groups',
			control: 'boolean',
		}),
	},
	args: {
		name: 'example',
		value: '',
		placeholder: '',
		autocomplete: '',
		required: false,
		disabled: false,
		label: 'Example Select',
		instructions: 'This is an example instruction.',
		errors: '',
		grouped: false,
	},
	render: (args) => {
		const optionMarkup = options.map((option) => `<option>${option}</option>`).join('');
		return `<select-input${attrs({
			name: args.name,
			value: args.value,
			placeholder: args.placeholder,
			autocomplete: args.autocomplete,
			class: args.required && 'required',
			disabled: args.disabled,
		})}>
	<span slot="label">${args.label ?? ''}</span>${args.instructions ? `
	<span slot="instructions">${args.instructions}</span>` : ''}${args.errors ? `
	<span slot="errors">${args.errors}</span>` : ''}
	${args.grouped ? `<optgroup label="Example group">${optionMarkup}</optgroup>` : optionMarkup}
</select-input>`;
	},
};

export const Default = {};
