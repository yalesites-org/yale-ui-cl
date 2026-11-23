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
    heading: attributeArg('Optional visible heading shown above the grid. It also names the viewer; without it the viewer is named "Image viewer".', { control: 'text' }),
    'heading-level': attributeArg('The heading level, so it fits the page outline. Defaults to 2.', {
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6'],
    }),
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
    `<ycl-image-gallery${attrs({ label: args.label, heading: args.heading, 'heading-level': args['heading-level'], narrow: args.narrow, interactive: args.interactive })}>
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
    `<ycl-image-gallery${attrs({ label: args.label, heading: args.heading, 'heading-level': args['heading-level'], narrow: args.narrow, interactive: args.interactive })}>
      ${images.slice(0, 3).map(([alt, label], index) => `<ycl-image-block>
        <ycl-image ratio="3x2"><img src="${photo(index + 1, label)}" alt="${alt}" width="1200" height="800"></ycl-image>
        <span slot="caption">${captions[index]}</span>
      </ycl-image-block>`).join('\n      ')}
    </ycl-image-gallery>`,
};

export const WithCaptionHeadings = {
  args: {
    interactive: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Add an element with `slot="caption-heading"` to an item. Its text becomes an `h2` above the caption in the viewer, and its `id`, if any, is kept so a link can point at it. Captions can hold `a`, `strong`, `em`, `br` and `p`. Caption markup is trusted: the component does not sanitize it, so the application that supplies it must clean any untrusted input first.',
      },
    },
  },
  render: (args) =>
    `<ycl-image-gallery${attrs({ label: args.label, heading: args.heading, 'heading-level': args['heading-level'], narrow: args.narrow, interactive: args.interactive })}>
      ${images.slice(0, 3).map(([alt, label], index) => `<ycl-image-block>
        <ycl-image ratio="3x2"><img src="${photo(index + 1, label)}" alt="${alt}" width="1200" height="800"></ycl-image>
        <span slot="caption-heading" id="photo-${index + 1}">${alt}</span>
        <span slot="caption">${captions[index]} <a href="https://yale.edu">Learn more</a>.</span>
      </ycl-image-block>`).join('\n      ')}
    </ycl-image-gallery>`,
};

export const WithHeading = {
  args: {
    heading: 'Around campus',
    'heading-level': '2',
    interactive: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'The heading shows above the grid and names the viewer. Set `heading-level` so it fits the page outline.',
      },
    },
  },
};

export const Narrow = {
  args: {
    narrow: true,
  },
};

export const LinkToAPhoto = {
  args: {
    interactive: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Use a link whose `href` is `#` plus the `id` of a photo\'s caption heading to open the viewer on that photo. Try "Jump to photo 2" or "Jump to photo 3". Opening the page with the hash in the URL does the same. Only photos with a caption heading `id` can be linked. Caption heading ids must be unique on a page: if two galleries share an id, both open. The hash stays in the URL after the viewer closes.',
      },
    },
  },
  render: (args) =>
    `<p><a href="#link-photo-2">Jump to photo 2</a> | <a href="#link-photo-3">Jump to photo 3</a></p>
    <ycl-image-gallery${attrs({ label: args.label, heading: args.heading, 'heading-level': args['heading-level'], narrow: args.narrow, interactive: args.interactive })}>
      ${images.slice(0, 3).map(([alt, label], index) => `<ycl-image-block>
        <ycl-image ratio="3x2"><img src="${photo(index + 1, label)}" alt="${alt}" width="1200" height="800"></ycl-image>
        <span slot="caption-heading" id="link-photo-${index + 1}">${alt}</span>
        <span slot="caption">${captions[index]}</span>
      </ycl-image-block>`).join('\n      ')}
    </ycl-image-gallery>`,
};
