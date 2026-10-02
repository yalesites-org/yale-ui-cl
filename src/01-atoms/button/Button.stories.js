import "./Button";
import "../text-input/TextInput";
export default {
  title: 'Button',
  component: 'ycl-button',
  argTypes: {
    content: {control: 'text'},
    href: {control: 'text'},
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
    controlType: 'default',
    expanded: 'none',
    disabled: false,
  },

  render: (args) =>
    `<ycl-button
      ${args.href ? `href="${args.href}"` : ''}
      ${args.controlType === 'dropdown' ? 'control-type="dropdown"' : ''}
      ${args.expanded !== 'none' ? `expanded="${args.expanded}"` : ''}
      ${args.disabled ? 'disabled' : ''}>${args.content}</ycl-button>`,
};

export const Default = {};

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
      <text-input name="email" type="email">
        <span slot="label">Email address</span>
      </text-input>
      <ycl-button type="submit">Subscribe</ycl-button>
      <ycl-button type="reset">Clear</ycl-button>
      <output role="status"></output>
    </form>`,
};
