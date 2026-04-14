import { TextInput } from "./TextInput";
export default {
  title: 'Text Input',
  component: 'text-input',
  argTypes: {
    label: {control: 'text'},
    instructions: {control: 'text'},
	  errors: {control: 'text'},
},
  args: {
    label: 'Yale HomePage',
    instructions: 'This is an example instruction.',
	  errors: 'This is an example error'
},

  render: (args) => 
    `<text-input class="">
		<span slot="label">${args.label}</span>
		<span slot="instructions">This is an example instruction</span>
		<span slot="errors">This is an error.</span>
	</text-input>`,
};

export const Example = {
  args: {
  },

  render: (args) =>
    `<text-input class="">
		<span slot="label">${args.label}</span>
		<span slot="instructions">${args.instructions}</span>
		<span slot="errors">${args.errors}</span>
	</text-input>`
};
