import "./Button";
import "../text-input/TextInput";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Atoms/Button',
  component: 'ycl-button',
  argTypes: {
    href: attributeArg('Renders the button as a link to this URL (ignored for dropdowns).', { control: 'text' }),
    type: attributeArg('Form behavior: submit or reset the form the button sits in.', {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      mapping: { button: undefined },
    }),
    fill: attributeArg('CTA fill, set as a class.', { name: 'Fill Type', control: 'select', options: ['outline', 'filled'] }),
    secondary: attributeArg('Secondary color scheme (class "secondary").', { control: 'boolean' }),
    size: attributeArg('Size, set as a class.', {
      control: 'select',
      options: ['default', 'small', 'medium', 'large'],
      mapping: { default: undefined },
    }),
    radius: attributeArg('Corner radius, set as a class.', {
      name: 'Radius Type',
      control: 'select',
      options: ['none', 'radius-soft', 'radius-pill'],
      mapping: { none: undefined },
    }),
    animate: attributeArg('Hover animation, set as a class.', {
      name: 'Animation Type',
      control: 'select',
      options: ['animate-fade', 'animate-none', 'animate-rise', 'animate-wipe'],
      mapping: { 'animate-fade': undefined },
    }),
    controlType: attributeArg('control-type="dropdown" adds a dropdown arrow and always renders a button.', {
      name: 'Control Type',
      control: 'select',
      options: ['default', 'dropdown'],
      mapping: { default: undefined },
    }),
    expanded: attributeArg('Toggle state reflected as aria-expanded; omit for a button that is not a toggle.', {
      control: 'select',
      options: ['none', 'false', 'true'],
      mapping: { none: undefined },
    }),
    label: attributeArg('Accessible name (aria-label) when the visible text is not enough.', { control: 'text' }),
    disabled: attributeArg('Disables the button.', { control: 'boolean' }),
    content: slotArg('Button text (default slot).', { control: 'text' }),
  },
  args: {
    content: 'Show more events',
    href: '',
    type: 'button',
    fill: 'outline',
    secondary: false,
    size: 'default',
    radius: 'none',
    animate: 'animate-fade',
    controlType: 'default',
    expanded: 'none',
    label: '',
    disabled: false,
  },

  render: (args) => {
    const classes = [args.fill, args.secondary && 'secondary', args.size, args.radius, args.animate].filter(Boolean).join(' ');
    return `<ycl-button${attrs({
      class: classes,
      href: args.href,
      type: args.type,
      'control-type': args.controlType,
      expanded: args.expanded,
      label: args.label,
      disabled: args.disabled,
    })}>${args.content ?? ''}</ycl-button>`;
  },
};

export const Default = {};

export const InAForm = {
  parameters: {
    docs: {
      description: {
        story: 'Submit and reset buttons act on the light-DOM form they sit in. Controls render a single button, so they cannot show it working inside a form next to a field.',
      },
    },
  },
  render: () =>
    `<form onsubmit="event.preventDefault(); this.querySelector('output').value = 'Submitted';">
      <text-input name="email" type="email">
        <span slot="label">Email address</span>
      </text-input>
      <ycl-button type="submit">Subscribe</ycl-button>
      <ycl-button type="reset">Clear</ycl-button>
      <output role="status"></output>
    </form>`,
};
