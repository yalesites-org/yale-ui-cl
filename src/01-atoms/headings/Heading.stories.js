import "./Heading";
import { icons } from "../icons/icons.js";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Atoms/Heading',
  component: 'ycl-heading',
  argTypes: {
    level: attributeArg('level: the hN element rendered (defaults to 2).', {
      name: 'Heading level',
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6'],
    }),
    appearance: attributeArg('appearance: type style to use when it should differ from the outline level.', {
      name: 'Visual style',
      control: 'select',
      options: ['', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    }),
    prefix: attributeArg('prefix: short label shown before the heading text. Omitted when empty.', { control: 'text' }),
    prefixIcon: attributeArg('prefix-icon: name of an icon shown before the heading. Omitted when empty.', {
      name: 'Prefix icon',
      control: 'select',
      options: ['', ...Object.keys(icons)],
    }),
    href: attributeArg('href: makes the heading text a link. Omitted when empty.', { name: 'Link URL', control: 'text' }),
    id: attributeArg('id: makes the heading a fragment target (it gets tabindex="-1"). Omitted when empty.', { control: 'text' }),
    heading: slotArg('Heading text (default slot).', { control: 'text' }),
  },
  args: {
    heading: 'Yale University Art Gallery',
    level: '2',
    appearance: '',
    prefix: '',
    prefixIcon: '',
    href: '',
    id: '',
  },
  render: (args) =>
    `<ycl-heading${attrs({
      level: args.level,
      appearance: args.appearance,
      prefix: args.prefix,
      'prefix-icon': args.prefixIcon,
      href: args.href,
      id: args.id,
    })}>${args.heading ?? ''}</ycl-heading>`,
};

export const Default = {};

export const AllLevels = {
  parameters: {
    docs: {
      description: {
        story: 'All six levels stacked for comparison. Controls render one heading at a time, so they cannot show the scale together.',
      },
    },
  },
  render: () =>
    ['1', '2', '3', '4', '5', '6'].map((level) =>
      `<ycl-heading level="${level}" style="margin-bottom: 1rem;">Heading level ${level}</ycl-heading>`).join(''),
};
