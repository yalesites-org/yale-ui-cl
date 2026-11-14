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
    narrow: attributeArg('Keeps two images across at every width, for a narrow column. Without it the grid is 2 across on small screens, 3 from the medium breakpoint and 4 from the large.', {
      control: 'boolean',
    }),
    interactive: attributeArg('Opens each image in a full-screen viewer with previous and next buttons that wrap around and a numbered pager. Escape closes it and the arrow keys step through the images.', {
      control: 'boolean',
    }),
    items: slotArg('The default slot: one `ycl-image` (or `ycl-image-block` when the image has a caption) per item. Every image needs alt text that describes it.', {
      control: false,
    }),
  },
  args: {
    label: 'Campus photos',
    narrow: false,
    interactive: false,
  },

  render: (args) =>
    `<ycl-image-gallery${attrs({ label: args.label, narrow: args.narrow, interactive: args.interactive })}>
      ${images.map(item).join('\n      ')}
    </ycl-image-gallery>`,
};

export const ImageGrid = {};

export const InteractiveGrid = {
  args: {
    interactive: true,
  },
};

const captions = [
  'Students cross the quad on the first warm day of spring.',
  'The reading room, where long wooden tables hold the quiet of exam week.',
  'The stone gate marks the old edge of campus and turns gold each October, when the leaves fall and visitors gather beneath it for photographs, a tradition that goes back generations.',
];

export const WithCaptions = {
  args: {
    interactive: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use `ycl-image-block` for items that have a caption. The caption shows in the viewer only, not under the thumbnail; a long one is trimmed with a Show more toggle.',
      },
    },
  },
  render: (args) =>
    `<ycl-image-gallery${attrs({ label: args.label, narrow: args.narrow, interactive: args.interactive })}>
      ${images.slice(0, 3).map(([alt, label], index) => `<ycl-image-block>
        <ycl-image ratio="3x2"><img src="${photo(index + 1, label)}" alt="${alt}" width="1200" height="800"></ycl-image>
        <span slot="caption">${captions[index]}</span>
      </ycl-image-block>`).join('\n      ')}
    </ycl-image-gallery>`,
};

export const Narrow = {
  args: {
    narrow: true,
  },
};
