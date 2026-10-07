import "./Button";
import "../text-input/TextInput";
export default {
  title: 'Atoms/Button',
  component: 'ycl-button',
  argTypes: {
    content: {control: 'text'},
    href: {control: 'text'},
    fill: {
      name: 'Fill Type',
      type: 'select',
      options: ['outline', 'filled'],
    },
    radius: {
      name: 'Radius Type',
      type: 'select',
      options: ['none', 'radius-soft', 'radius-pill'],
    },
    animate: {
      name: 'Animation Type',
      type: 'select',
      options: ['none', 'animate-fade', 'animate-rise', 'animate-wipe'],
    },
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
    fill: 'outline',
    radius: 'none',
    animate: 'none',
    controlType: 'default',
    expanded: 'none',
    disabled: false,
  },

  render: (args) =>
    `<ycl-button
      class="${[args.fill, args.radius, args.animate].filter((c) => c && c !== 'none').join(' ')}"
      ${args.href ? `href="${args.href}"` : ''}
      ${args.controlType === 'dropdown' ? 'control-type="dropdown"' : ''}
      ${args.expanded !== 'none' ? `expanded="${args.expanded}"` : ''}
      ${args.disabled ? 'disabled' : ''}>${args.content}</ycl-button>`,
};

export const Default = {};

export const Filled = {
  args: {
    fill: 'filled',
  },
};

export const Pill = {
  args: {
    fill: 'filled',
    radius: 'radius-pill',
    animate: 'animate-fade',
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
      <text-input name="email" type="email">
        <span slot="label">Email address</span>
      </text-input>
      <ycl-button type="submit">Subscribe</ycl-button>
      <ycl-button type="reset">Clear</ycl-button>
      <output role="status"></output>
    </form>`,
};
