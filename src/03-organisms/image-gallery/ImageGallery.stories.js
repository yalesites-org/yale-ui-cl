import "./ImageGallery";
import "../../01-atoms/image/ResponsiveImage";
import "../../02-molecules/image/ImageBlock";
import { attrs, attributeArg, slotArg, placeholder } from "../../../.storybook/story-helpers.js";

const photo = (n, label) => placeholder(1200, 800, label ?? `Photo ${n}`);

// Alt text describes what is in the photo. A decorative image would take alt="", but gallery
// images carry content, so each one needs a real description.
const images = [
  ['Students crossing a sunlit quad', 'Photo 1'],
  ['A reading room with long wooden tables', 'Photo 2'],
  ['A stone gate in autumn', 'Photo 3'],
  ['A laboratory bench with glassware', 'Photo 4'],
  ['A rehearsal in a small theater', 'Photo 5'],
  ['A bicycle leaning on a brick wall', 'Photo 6'],
];

const item = ([alt, label], index) =>
  `<ycl-image ratio="3x2"><img src="${photo(index + 1, label)}" alt="${alt}" width="1200" height="800"></ycl-image>`;

export default {
  title: 'Organisms/Image Gallery',
  component: 'ycl-image-gallery',
  argTypes: {
    label: attributeArg('Accessible name of the list of images.', { control: 'text' }),
    columns: attributeArg('Columns from the medium breakpoint up. Two columns on small screens.', {
      control: 'select',
      options: ['2', '3', '4'],
      mapping: { 3: undefined },
    }),
    interactive: attributeArg('Opens each image in a viewer with previous and next buttons. The viewer is a modal dialog: Escape closes it and the arrow keys step through the images.', {
      control: 'boolean',
    }),
    items: slotArg('The default slot: one `ycl-image` (or `ycl-image-block` when the image has a caption) per item. Every image needs alt text that describes it.', {
      control: false,
    }),
  },
  args: {
    label: 'Campus photos',
    columns: '3',
    interactive: false,
  },

  render: (args) =>
    `<ycl-image-gallery${attrs({ label: args.label, columns: args.columns, interactive: args.interactive })}>
      ${images.map(item).join('\n      ')}
    </ycl-image-gallery>`,
};

export const ImageGrid = {};

export const InteractiveGrid = {
  args: {
    interactive: true,
  },
};

export const WithCaptions = {
  args: {
    interactive: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `ycl-image-block` for items that have a caption. The caption shows under the thumbnail and in the viewer.',
      },
    },
  },
  render: (args) =>
    `<ycl-image-gallery${attrs({ label: args.label, columns: args.columns, interactive: args.interactive })}>
      ${images.slice(0, 3).map(([alt, label], index) => `<ycl-image-block>
        <ycl-image ratio="3x2"><img src="${photo(index + 1, label)}" alt="${alt}" width="1200" height="800"></ycl-image>
        <span slot="caption">${alt}.</span>
      </ycl-image-block>`).join('\n      ')}
    </ycl-image-gallery>`,
};
