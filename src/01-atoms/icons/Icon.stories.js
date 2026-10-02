import "./Icon";
import { icons } from "./icons.js";

const names = Object.keys(icons);

export default {
  title: 'Icon',
  component: 'ycl-icon',
  argTypes: {
    name: {
      name: 'Icon',
      control: 'select',
      options: names,
    },
    label: {
      name: 'Accessible label',
      description: 'Leave empty for a decorative icon',
      control: 'text',
    },
    size: {
      name: 'Size',
      control: 'select',
      options: ['1em', '2rem', '4rem', '6rem'],
    },
  },
  args: {
    name: 'graduation-cap-solid',
    label: '',
    size: '4rem',
  },
  render: (args) =>
    `<ycl-icon name="${args.name}" ${args.label ? `label="${args.label}"` : ''} style="width: ${args.size}; height: ${args.size};"></ycl-icon>`,
};

export const Default = {};

export const Labelled = {
  args: {
    name: 'location-dot-solid',
    label: 'Location',
  },
};

export const InlineWithText = {
  render: () =>
    `<p><ycl-icon name="calendar-solid"></ycl-icon> October 14, 2026</p>
    <p><ycl-icon name="envelope-solid"></ycl-icon> <a href="mailto:info@yale.edu">info@yale.edu</a></p>
    <p><ycl-icon name="location-dot-solid"></ycl-icon> Sterling Memorial Library, 120 High Street</p>`,
};

export const AllIcons = {
  render: () =>
    `<div style="display: flex; flex-wrap: wrap; gap: 1rem;">
      ${names.map((name) => `<figure style="margin: 0; width: 8rem; text-align: center;">
        <ycl-icon name="${name}" style="width: 3rem; height: 3rem;"></ycl-icon>
        <figcaption><code>${name}</code></figcaption>
      </figure>`).join('')}
    </div>`,
};
