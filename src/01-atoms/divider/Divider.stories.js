import "./Divider";
import { attrs, attributeArg } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Atoms/Divider',
  component: 'ycl-divider',
  argTypes: {
    width: attributeArg('width: percentage of the container the line spans.', {
      name: 'Divider width',
      control: 'select',
      options: ['100', '75', '50', '25'],
    }),
    position: attributeArg('position: alignment of a line narrower than its container.', {
      name: 'Divider position',
      control: 'select',
      options: ['center', 'left', 'right'],
    }),
    thickness: attributeArg('thickness: line thickness token.', {
      name: 'Line thickness',
      control: 'select',
      options: ['hairline', '1', '2', '4', '6', '8'],
    }),
    animate: attributeArg('animate: the line expands out the first time it scrolls into view.', {
      name: 'Animate on scroll',
      control: 'boolean',
    }),
    dividerColor: attributeArg('style: line color, set through the --color-divider custom property.', {
      name: 'Line color',
      control: 'select',
      options: ['gray-500', 'blue-yale', 'basic-brown-gray'],
    }),
  },
  args: {
    width: '100',
    position: 'center',
    thickness: 'hairline',
    dividerColor: 'gray-500',
    animate: false,
  },
  render: (args) =>
    `<ycl-divider${attrs({
      width: args.width,
      position: args.position,
      thickness: args.thickness,
      animate: args.animate,
      style: args.dividerColor && `--color-divider: var(--color-${args.dividerColor});`,
    })}></ycl-divider>`,
};

export const Default = {};

export const AllVariants = {
  parameters: {
    docs: {
      description: {
        story: 'Every width, position and thickness stacked for comparison. Controls render one divider at a time, so they cannot lay several out side by side.',
      },
    },
  },
  render: () => [
    ...['25', '50', '75', '100'].map((width) => `<ycl-divider width="${width}" thickness="2" style="margin-block: 2rem;"></ycl-divider>`),
    ...['left', 'center', 'right'].map((position) => `<ycl-divider width="50" position="${position}" thickness="2" style="margin-block: 2rem;"></ycl-divider>`),
    ...['hairline', '1', '2', '4', '6', '8'].map((thickness) => `<ycl-divider thickness="${thickness}" style="margin-block: 2rem;"></ycl-divider>`),
  ].join(''),
};
