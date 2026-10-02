import "./Divider";
export default {
  title: 'Divider',
  component: 'ycl-divider',
  argTypes: {
    width: {
      name: 'Divider width',
      type: 'select',
      options: ['100', '75', '50', '25'],
    },
    position: {
      name: 'Divider position',
      type: 'select',
      options: ['center', 'left', 'right'],
    },
    thickness: {
      name: 'Line thickness',
      type: 'select',
      options: ['hairline', '1', '2', '4', '6', '8'],
    },
    dividerColor: {
      name: 'Line color',
      type: 'select',
      options: ['gray-500', 'blue-yale', 'basic-brown-gray'],
    },
    animate: { name: 'Animate on scroll', control: 'boolean' },
  },
  args: {
    width: '100',
    position: 'center',
    thickness: 'hairline',
    dividerColor: 'gray-500',
    animate: false,
  },
  render: (args) =>
    `<ycl-divider width="${args.width}" position="${args.position}" thickness="${args.thickness}" ${args.animate ? 'animate' : ''} style="--color-divider: var(--color-${args.dividerColor});"></ycl-divider>`,
};

export const Default = {};

export const Widths = {
  render: () =>
    ['25', '50', '75', '100'].map((width) =>
      `<ycl-divider width="${width}" thickness="2" style="margin-block: 2rem;"></ycl-divider>`).join(''),
};

export const Positions = {
  render: () =>
    ['left', 'center', 'right'].map((position) =>
      `<ycl-divider width="50" position="${position}" thickness="2" style="margin-block: 2rem;"></ycl-divider>`).join(''),
};

export const Thicknesses = {
  render: () =>
    ['hairline', '1', '2', '4', '6', '8'].map((thickness) =>
      `<ycl-divider thickness="${thickness}" style="margin-block: 2rem;"></ycl-divider>`).join(''),
};

export const BlueYale = {
  args: {
    thickness: '8',
    dividerColor: 'blue-yale',
  },
};

export const Animated = {
  args: {
    width: '75',
    thickness: '4',
    animate: true,
  },
};
