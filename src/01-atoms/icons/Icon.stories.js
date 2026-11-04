import "./Icon";
import { icons } from "./icons.js";
import { attrs, attributeArg } from "../../../.storybook/story-helpers.js";

const names = Object.keys(icons);

export default {
  title: 'Atoms/Icon',
  component: 'ycl-icon',
  argTypes: {
    name: attributeArg('name: which icon to draw.', { name: 'Icon', control: 'select', options: names }),
    label: attributeArg('label: accessible name. Leave empty for a decorative icon, which is hidden from screen readers.', {
      name: 'Accessible label',
      control: 'text',
    }),
    size: attributeArg('style: width and height, set inline on the host.', {
      name: 'Size',
      control: 'select',
      options: ['1em', '2rem', '4rem', '6rem'],
    }),
  },
  args: {
    name: 'graduation-cap-solid',
    label: '',
    size: '4rem',
  },
  render: (args) =>
    `<ycl-icon${attrs({
      name: args.name,
      label: args.label,
      style: args.size && `width: ${args.size}; height: ${args.size};`,
    })}></ycl-icon>`,
};

export const Default = {};

export const InlineWithText = {
  parameters: {
    docs: {
      description: {
        story: 'Decorative icons sitting inline next to text and a link. Controls render a lone icon, so they cannot show it composed with surrounding content.',
      },
    },
  },
  render: () =>
    `<p><ycl-icon name="calendar-solid"></ycl-icon> October 14, 2026</p>
    <p><ycl-icon name="envelope-solid"></ycl-icon> <a href="mailto:info@yale.edu">info@yale.edu</a></p>
    <p><ycl-icon name="location-dot-solid"></ycl-icon> Sterling Memorial Library, 120 High Street</p>`,
};

export const AllIcons = {
  parameters: {
    docs: {
      description: {
        story: 'Every available icon in a grid with its name. Controls show one icon at a time.',
      },
    },
  },
  render: () =>
    `<div style="display: flex; flex-wrap: wrap; gap: 1rem;">
      ${names.map((name) => `<figure style="margin: 0; width: 8rem; text-align: center;">
        <ycl-icon name="${name}" style="width: 3rem; height: 3rem;"></ycl-icon>
        <figcaption><code>${name}</code></figcaption>
      </figure>`).join('')}
    </div>`,
};
