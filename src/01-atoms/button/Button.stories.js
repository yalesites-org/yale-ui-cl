import "./Button";
import "../text-input/TextInput";
import { optionAttributes, optionArgTypes } from "../cta/cta-story-options.js";

export default {
  title: 'Atoms/Button',
  component: 'ycl-button',
  argTypes: {
    content: {control: 'text'},
    href: {control: 'text'},
    ...optionArgTypes,
    controlType: {
      name: 'Control Type',
      type: 'select',
      options: ['default', 'dropdown'],
    },
    expanded: {
      type: 'select',
      options: ['none', 'false', 'true'],
    },
    disabled: {control: 'boolean'},
  },
  args: {
    content: 'Show more events',
    href: '',
    variant: 'outline',
    animate: 'fade',
    radius: 'none',
    controlType: 'default',
    expanded: 'none',
    disabled: false,
  },

  render: (args) =>
    `<ycl-button
      ${optionAttributes(args)}
      ${args.href ? `href="${args.href}"` : ''}
      ${args.controlType === 'dropdown' ? 'control-type="dropdown"' : ''}
      ${args.expanded !== 'none' ? `expanded="${args.expanded}"` : ''}
      ${args.disabled ? 'disabled' : ''}>${args.content}</ycl-button>`,
};

export const Default = {};

export const Filled = {
  args: {
    variant: 'filled',
  },
};

export const Pill = {
  args: {
    variant: 'filled',
    radius: 'pill',
  },
};

export const Dropdown = {
  args: {
    content: 'Menu',
    controlType: 'dropdown',
    expanded: 'false',
  },
};

export const Link = {
  args: {
    content: 'Visit the Yale homepage',
    href: 'https://www.yale.edu',
  },
};

export const Disabled = {
  args: {
    disabled: true,
  },
};

// Submit and reset buttons act on the light-DOM form they sit in.
export const InAForm = {
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
