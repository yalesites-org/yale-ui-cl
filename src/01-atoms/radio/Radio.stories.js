import "./Radio";
import { attrs, attributeArg, slotArg, eventArg } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Atoms/Radio',
  component: 'ycl-radio',
  argTypes: {
    name: attributeArg('name: radios with the same name in the same form form one group.', { control: 'text' }),
    value: attributeArg('value: submitted while checked. Defaults to "on".', { control: 'text' }),
    checked: attributeArg('checked: whether the radio is selected. Checking one unchecks the rest of its group.', { control: 'boolean' }),
    required: attributeArg('required: the group is invalid until one of its radios is checked.', { control: 'boolean' }),
    disabled: attributeArg('disabled: disables the radio and skips it in arrow-key navigation.', { control: 'boolean' }),
    label: slotArg('Radio label (default slot).', { control: 'text' }),
    input: eventArg('Fired (bubbling, composed) on the host when the user checks the radio: by click it is the inner radio\'s native input event, and by arrow keys it is dispatched on the newly checked radio.'),
    change: eventArg('Fired (bubbling, not composed) on the host when the user checks the radio, by click or arrow keys, after checked is updated.'),
  },
  args: {
    name: 'option',
    value: '1',
    checked: false,
    required: false,
    disabled: false,
    label: 'Option 1',
  },
  render: ({ label, ...attributes }) =>
    `<ycl-radio${attrs(attributes)}>${label ?? ''}</ycl-radio>`,
};

export const Default = {};

// The library has no .h3 utility class, so the legend takes the h3 type style inline.
export const GroupInAForm = {
  parameters: {
    docs: {
      description: {
        story: 'A required group of radios in a `<fieldset>` with a `<legend>` inside a form, with one option disabled: arrow keys move between options and the form will not submit until one is chosen. Controls render one radio, so they cannot compose a group.',
      },
    },
  },
  render: () =>
    `<form onsubmit="event.preventDefault(); this.querySelector('output').value = new FormData(this).get('campus') ?? '(nothing)';">
      <fieldset>
        <legend style="font: var(--font-style-heading-h3-yale-new);">Which campus do you visit most?</legend>
        <ycl-radio name="campus" value="central" required>Central Campus</ycl-radio>
        <ycl-radio name="campus" value="science-hill">Science Hill</ycl-radio>
        <ycl-radio name="campus" value="medical" disabled>Medical Campus (closed for renovation)</ycl-radio>
        <ycl-radio name="campus" value="west">West Campus</ycl-radio>
      </fieldset>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
      <p>Submitted: <output role="status"></output></p>
    </form>`,
};
