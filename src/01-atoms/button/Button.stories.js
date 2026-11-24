import "./Button";
import "../text-input/TextInput";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";
import { ctaArgTypes, ctaAttributes } from "../cta/cta-story-options.js";

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
    ...ctaArgTypes,
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
    variant: 'outline',
    outlineWeight: '2',
    animate: 'fade',
    radius: 'none',
    controlType: 'default',
    expanded: 'none',
    label: '',
    disabled: false,
  },

  render: (args) =>
    `<ycl-button${attrs({
      ...ctaAttributes(args),
      href: args.href,
      type: args.type,
      'control-type': args.controlType,
      expanded: args.expanded,
      label: args.label,
      disabled: args.disabled,
    })}>${args.content ?? ''}</ycl-button>`,
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
      <ycl-text-input name="email" type="email">
        <span slot="label">Email address</span>
      </ycl-text-input>
      <ycl-button type="submit">Subscribe</ycl-button>
      <ycl-button type="reset">Clear</ycl-button>
      <output role="status"></output>
    </form>`,
};
