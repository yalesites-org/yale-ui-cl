import "./Checkbox";
export default {
  title: 'Atoms/Checkbox',
  component: 'ycl-checkbox',
  argTypes: {
    legend: {control: 'text'},
    required: {control: 'boolean'},
    disabled: {control: 'boolean'},
  },
  args: {
    legend: 'Options as Checkboxes',
    required: false,
    disabled: false,
  },

  // The library has no .h3 utility class, so the legend takes the h3 type style inline.
  render: (args) =>
    `<form onsubmit="event.preventDefault(); this.querySelector('output').value = [...new FormData(this).values()].join(', ') || '(nothing)';">
      <fieldset ${args.disabled ? 'disabled' : ''}>
        <legend style="font: var(--font-style-heading-h3-yale-new);">${args.legend}</legend>
        <ycl-checkbox name="options" value="1" checked ${args.required ? 'required' : ''}>Option 1</ycl-checkbox>
        <ycl-checkbox name="options" value="2">Option 2</ycl-checkbox>
        <ycl-checkbox name="options" value="3">Option 3</ycl-checkbox>
        <ycl-checkbox name="options" value="4">Option 4</ycl-checkbox>
      </fieldset>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
      <p>Submitted: <output role="status"></output></p>
    </form>`,
};

export const Default = {};

export const Required = {
  args: {
    required: true,
  },
  render: (args) =>
    `<form onsubmit="event.preventDefault();">
      <ycl-checkbox name="terms" ${args.required ? 'required' : ''}>I have read the Yale Privacy Policy</ycl-checkbox>
      <button type="submit">Submit</button>
    </form>`,
};

export const Disabled = {
  args: {
    disabled: true,
  },
};
