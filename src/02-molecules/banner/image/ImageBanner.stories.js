import "./ImageBanner";
import "../../../01-atoms/image/ResponsiveImage";

// An inline placeholder so the story doesn't depend on a hosted image.
const placeholderImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#978d85"/><text x="800" y="450" font-family="sans-serif" font-size="96" fill="#fff" text-anchor="middle" dominant-baseline="middle">16 x 9</text></svg>')}`;

export default {
  title: 'Molecules/Banners/Image Banner',
  component: 'ycl-image-banner',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: {
      name: 'Component Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
    globalTheme: {
      name: 'Site Global Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
    size: {
      name: 'Image Size',
      type: 'select',
      options: ['tall', 'short', 'mini'],
    },
    caption: {control: 'text'},
    width: {
      name: 'Banner Width',
      type: 'select',
      options: ['site', 'full'],
    },
  },
  args: {
    theme: 'one',
    globalTheme: 'one',
    size: 'tall',
    caption: 'Image Caption',
    width: 'site',
  },

  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-image-banner theme="${args.theme}" size="${args.size}" width="${args.width}">
        <ycl-image><img src="${placeholderImage}" alt="A 16 by 9 image"></ycl-image>
        ${args.caption ? `<span slot="caption">${args.caption}</span>` : ''}
      </ycl-image-banner>
    </div>`,
};

export const Default = {};

export const Short = {
  args: {
    size: 'short',
  },
};

export const Mini = {
  args: {
    size: 'mini',
  },
};

export const FullWidth = {
  args: {
    width: 'full',
  },
};
