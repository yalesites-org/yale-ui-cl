import "./ImageBlock";
import "../../01-atoms/image/ResponsiveImage";
import "../../01-atoms/text-link/Link";
import { attrs, attributeArg, slotArg, placeholder } from "../../../.storybook/story-helpers.js";

const image = placeholder(1600, 900, "16:9");

export default {
  title: 'Molecules/Image Block',
  component: 'ycl-image-block',
  argTypes: {
    width: attributeArg('How wide the block runs.', {
      name: 'Width',
      control: 'select',
      options: ['content', 'highlight', 'site', 'max'],
    }),
    alignment: attributeArg('Center or left-align the block.', {
      name: 'Alignment',
      control: 'select',
      options: ['center', 'left'],
    }),
    alt: slotArg('Alt text of the slotted image. The image (an `<img>`, `<picture>` or ycl-image) goes in the default slot.', {
      name: 'Alt Text',
      control: 'text',
    }),
    caption: slotArg('Caption (slot="caption"). Without one the figure is presentational. Omitted when empty.', {
      name: 'Caption',
      control: 'text',
    }),
  },
  args: {
    alt: 'A 16 by 9 image',
    caption: 'This is the <text-link href="#">caption</text-link> for the 16:9 image above.',
    width: 'content',
    alignment: 'center',
  },

  render: (args) =>
    `<ycl-image-block${attrs({ width: args.width, alignment: args.alignment })}>
      <ycl-image><img src="${image}" alt="${args.alt ?? ''}" width="1600" height="900"></ycl-image>
      ${args.caption ? `<span slot="caption">${args.caption}</span>` : ''}
    </ycl-image-block>`,
};

export const Default = {};
