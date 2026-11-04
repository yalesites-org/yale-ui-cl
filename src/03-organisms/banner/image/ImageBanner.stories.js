import "./ImageBanner";
import "../../../01-atoms/image/ResponsiveImage";
import { attrs, attributeArg, slotArg } from "../../../../.storybook/story-helpers.js";
import { COLOR_OPTION_DESCRIPTION, colorOptionLabels } from "../../../00-tokens/theme/color-options.js";

// An inline placeholder so the story doesn't depend on a hosted image.
const placeholderImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#978d85"/><text x="800" y="450" font-family="sans-serif" font-size="96" fill="#fff" text-anchor="middle" dominant-baseline="middle">16 x 9</text></svg>')}`;

export default {
  title: 'Organisms/Banners/Image Banner',
  component: 'ycl-image-banner',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: attributeArg(COLOR_OPTION_DESCRIPTION, {
      name: 'Color Option',
      options: ['primary', 'secondary', 'tertiary', 'accent-1', 'accent-2'],
      control: { type: 'select', labels: colorOptionLabels('ycl-image-banner') },
    }),
    size: attributeArg('Banner height. Defaults to tall.', {
      name: 'Image Size',
      control: 'select',
      options: ['tall', 'short', 'mini'],
      mapping: { tall: undefined },
    }),
    width: attributeArg('Site width or full bleed. Defaults to site.', {
      name: 'Banner Width',
      control: 'select',
      options: ['site', 'full'],
    }),
    image: slotArg('The image (default slot), usually a ycl-image.', { control: false }),
    caption: slotArg('Caption bar (slot="caption"); hidden when empty.', { control: 'text' }),
  },
  args: {
    theme: 'primary',
    size: 'tall',
    caption: 'Image Caption',
    width: 'site',
  },

  render: (args) => `
      <ycl-image-banner${attrs({ theme: args.theme, size: args.size, width: args.width })}>
        <ycl-image><img src="${placeholderImage}" alt="A 16 by 9 image"></ycl-image>${args.caption ? `
        <span slot="caption">${args.caption}</span>` : ''}
      </ycl-image-banner>`,
};

export const Default = {};
