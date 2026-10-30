import "./TextInput";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

export default {
	title: 'Atoms/Text Input',
	component: 'text-input',
	argTypes: {
		type: attributeArg('Input type. Unsupported types fall back to text.', {
			control: 'select',
			options: ['text', 'date', 'datetime-local', 'tel', 'number', 'email'],
		}),
		name: attributeArg('Name the value is submitted under with its form.', { control: 'text' }),
		value: attributeArg('Current value.', { control: 'text' }),
		placeholder: attributeArg('Placeholder text shown while the field is empty.', { control: 'text' }),
		autocomplete: attributeArg('Autocomplete hint passed to the inner input (e.g. "name", "email").', { control: 'text' }),
		required: attributeArg('Adds the "required" class: the field is invalid while empty and its label is marked required.', { control: 'boolean' }),
		disabled: attributeArg('Disables the field.', { control: 'boolean' }),
		label: slotArg('Field label (slot="label").', { control: 'text' }),
		instructions: slotArg('Help text under the label (slot="instructions"). Omitted when empty.', { control: 'text' }),
		errors: slotArg('Error message (slot="errors"); any content marks the field invalid. Omitted when empty.', { control: 'text' }),
	},
	args: {
		type: 'text',
		name: 'name',
		value: '',
		placeholder: '',
		autocomplete: '',
		required: false,
		disabled: false,
		label: 'Name',
		instructions: 'This is an example instruction.',
		errors: '',
	},
	render: (args) =>
		`<text-input${attrs({
			type: args.type,
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
</text-input>`,
};

export const Default = {};
