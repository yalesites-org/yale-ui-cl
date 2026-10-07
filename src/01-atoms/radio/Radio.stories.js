import "./Radio";
export default {
  title: 'Atoms/Radio',
  component: 'ycl-radio',
  argTypes: {
    legend: {control: 'text'},
    required: {control: 'boolean'},
    disabled: {control: 'boolean'},
  },
  args: {
    legend: 'Options as Radio Buttons',
    required: false,
    disabled: false,
  },

  // The library has no .h3 utility class, so the legend takes the h3 type style inline.
  render: (args) =>
    `<form onsubmit="event.preventDefault(); this.querySelector('output').value = new FormData(this).get('option') ?? '(nothing)';">
      <fieldset ${args.disabled ? 'disabled' : ''}>
        <legend style="font: var(--font-style-heading-h3-yale-new);">${args.legend}</legend>
        <ycl-radio name="option" value="1" checked ${args.required ? 'required' : ''}>Option 1</ycl-radio>
        <ycl-radio name="option" value="2">Option 2</ycl-radio>
        <ycl-radio name="option" value="3">Option 3</ycl-radio>
        <ycl-radio name="option" value="4">Option 4</ycl-radio>
      </fieldset>
      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
      <p>Submitted: <output role="status"></output></p>
    </form>`,
};

export const Default = {};

// Nothing is checked, so the form won't submit until an option is chosen.
export const Required = {
  args: {
    legend: 'Which campus do you visit most?',
    required: true,
  },
  render: (args) =>
    `<form onsubmit="event.preventDefault();">
      <fieldset>
        <legend style="font: var(--font-style-heading-h3-yale-new);">${args.legend}</legend>
        <ycl-radio name="campus" value="central" ${args.required ? 'required' : ''}>Central Campus</ycl-radio>
        <ycl-radio name="campus" value="science-hill">Science Hill</ycl-radio>
        <ycl-radio name="campus" value="medical" disabled>Medical Campus (closed for renovation)</ycl-radio>
        <ycl-radio name="campus" value="west">West Campus</ycl-radio>
      </fieldset>
      <button type="submit">Submit</button>
    </form>`,
};

export const Disabled = {
  args: {
    disabled: true,
  },
};
