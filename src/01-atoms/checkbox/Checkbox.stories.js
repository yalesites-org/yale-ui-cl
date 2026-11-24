import "./Checkbox";
import { attrs, attributeArg, slotArg, eventArg } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Atoms/Checkbox',
  component: 'ycl-checkbox',
  argTypes: {
    name: attributeArg('Name the value is submitted under with its form.', { control: 'text' }),
    value: attributeArg('Value submitted while checked. Defaults to "on".', { control: 'text' }),
    checked: attributeArg('Whether the box is checked. Reflects the live state.', { control: 'boolean' }),
    required: attributeArg('The checkbox is invalid while unchecked.', { control: 'boolean' }),
    disabled: attributeArg('Disables the checkbox.', { control: 'boolean' }),
    label: slotArg('Checkbox label (default slot).', { control: 'text' }),
    input: eventArg('Native input event from the inner checkbox, fired each time the user toggles it. It bubbles and is composed, so it reaches the host with the host as its target.'),
    change: eventArg('Fired (bubbling, not composed) on the host after each user toggle, once checked reflects the new state.'),
  },
  args: {
    name: 'terms',
    value: '',
    checked: false,
    required: false,
    disabled: false,
    label: 'I have read the Yale Privacy Policy',
  },
  render: ({ label, ...attributes }) =>
    `<ycl-checkbox${attrs(attributes)}>${label ?? ''}</ycl-checkbox>`,
};

export const Default = {};

// The library has no .h3 utility class, so the legend takes the h3 type style inline.
export const GroupInAForm = {
  parameters: {
    docs: {
      description: {
        story: 'Several checkboxes grouped in a `<fieldset>` with a `<legend>` inside a form, showing what gets submitted. Controls render one checkbox, so they cannot compose a group.',
      },
    },
  },
  render: () =>
    `<form onsubmit="event.preventDefault(); this.querySelector('output').value = [...new FormData(this).values()].join(', ') || '(nothing)';">
      <fieldset>
        <legend style="font: var(--font-style-heading-h3-yale-new);">Options as Checkboxes</legend>
        <ycl-checkbox name="options" value="1" checked>Option 1</ycl-checkbox>
        <ycl-checkbox name="options" value="2">Option 2</ycl-checkbox>
        <ycl-checkbox name="options" value="3">Option 3</ycl-checkbox>
        <ycl-checkbox name="options" value="4">Option 4</ycl-checkbox>
      </fieldset>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
      <p>Submitted: <output role="status"></output></p>
    </form>`,
};
