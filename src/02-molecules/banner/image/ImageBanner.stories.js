import "./ImageBanner";
import "../../../01-atoms/image/ResponsiveImage";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme } from "../../../../.storybook/story-helpers.js";

// An inline placeholder so the story doesn't depend on a hosted image.
const placeholderImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#978d85"/><text x="800" y="450" font-family="sans-serif" font-size="96" fill="#fff" text-anchor="middle" dominant-baseline="middle">16 x 9</text></svg>')}`;

export default {
  title: 'Molecules/Banners/Image Banner',
  component: 'ycl-image-banner',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: attributeArg('Component theme (caption bar colours). Defaults to one.', {
      name: 'Component Theme',
      control: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
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
    globalTheme: globalThemeArgType,
  },
  args: {
    theme: 'one',
    globalTheme: 'one',
    size: 'tall',
    caption: 'Image Caption',
    width: 'site',
  },

  render: (args) => withGlobalTheme(args.globalTheme, `
      <ycl-image-banner${attrs({ theme: args.theme, size: args.size, width: args.width })}>
        <ycl-image><img src="${placeholderImage}" alt="A 16 by 9 image"></ycl-image>${args.caption ? `
        <span slot="caption">${args.caption}</span>` : ''}
      </ycl-image-banner>`),
};

export const Default = {};
