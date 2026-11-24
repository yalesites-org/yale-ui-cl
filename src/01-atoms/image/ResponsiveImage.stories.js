import "./ResponsiveImage";
import { attrs, attributeArg, slotArg, placeholder } from "../../../.storybook/story-helpers.js";

const ratios = {
  '16x9': [1600, 900],
  '3x2': [1500, 1000],
  '4x3': [1600, 1200],
  '1x1': [1000, 1000],
  '2x3': [1000, 1500],
  '1x1.6': [1000, 1600],
};

export default {
  title: 'Atoms/Image',
  component: 'ycl-image',
  argTypes: {
    aspectRatio: attributeArg('ratio: crops the image to a fixed aspect ratio. Empty keeps the image\'s own shape.', {
      name: 'Aspect Ratio',
      control: 'select',
      options: ['', ...Object.keys(ratios)],
    }),
    alt: slotArg('Alt text of the slotted `<img>` (default slot takes an `<img>` or `<picture>`).', { control: 'text' }),
    caption: slotArg('slot="caption": caption content. With a caption the image is exposed as a figure. Omitted when empty.', {
      control: 'text',
    }),
  },
  args: {
    aspectRatio: '16x9',
    alt: 'Sterling Memorial Library at dusk',
    caption: '',
  },
  render: (args) => {
    const [width, height] = ratios[args.aspectRatio] ?? ratios['3x2'];
    const label = args.aspectRatio || 'Natural size';
    return `<ycl-image${attrs({ ratio: args.aspectRatio })} style="max-width: 40rem;">
      <img src="${placeholder(width, height, label)}" alt="${args.alt ?? ''}">
      ${args.caption ? `<p slot="caption">${args.caption}</p>` : ''}
    </ycl-image>`;
  },
};

export const Default = {};

export const ResponsivePicture = {
  parameters: {
    docs: {
      description: {
        story: 'Slots a `<picture>` with art-directed `<source>`s instead of a single `<img>`. That is different child markup, which a control cannot switch on.',
      },
    },
  },
  render: () =>
    `<ycl-image style="max-width: 40rem;">
      <picture>
        <source media="(min-width: 992px)" srcset="${placeholder(1600, 900, 'Wide (16x9)')}">
        <img src="${placeholder(1000, 1000, 'Narrow (1x1)')}" alt="Old Campus in the fall">
      </picture>
      <span slot="caption">Resize the window past 992px to swap sources.</span>
    </ycl-image>`,
};

export const Ratios = {
  parameters: {
    docs: {
      description: {
        story: 'Every ratio side by side for comparison. Controls render one image at a time.',
      },
    },
  },
  render: () =>
    `<div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
      ${Object.entries(ratios).map(([ratio, [width, height]]) =>
        `<ycl-image ratio="${ratio}" style="flex: 1 0 clamp(10rem, 40%, 20rem);">
          <img src="${placeholder(width, height, ratio)}" alt="A ${ratio.replace('x', ' by ')} image">
        </ycl-image>`).join('')}
    </div>`,
};
