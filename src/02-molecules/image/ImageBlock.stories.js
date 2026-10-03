import "./ImageBlock";
import "../../01-atoms/image/ResponsiveImage";
import "../../01-atoms/text-link/Link";

// Inline placeholder so the story needs no network or image assets.
const placeholder = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#dddddd"/><text x="800" y="470" font-family="sans-serif" font-size="64" text-anchor="middle" fill="#4a4a4a">16:9</text></svg>')}`;

export default {
  title: 'Image Block',
  component: 'ycl-image-block',
  argTypes: {
    alt: {name: 'Alt Text', control: 'text'},
    caption: {name: 'Caption', control: 'text'},
    width: {
      name: 'Width',
      type: 'select',
      options: ['content', 'highlight', 'site', 'max'],
    },
    alignment: {
      name: 'Alignment',
      type: 'select',
      options: ['center', 'left'],
    },
},
  args: {
    alt: 'A 16 by 9 image',
    caption: 'This is the <text-link href="#">caption</text-link> for the 16:9 image above.',
    width: 'content',
    alignment: 'center',
},

  render: (args) =>
    `<ycl-image-block width="${args.width}" alignment="${args.alignment}">
      <ycl-image><img src="${placeholder}" alt="${args.alt}" width="1600" height="900"></ycl-image>
      ${args.caption ? `<span slot="caption">${args.caption}</span>` : ''}
    </ycl-image-block>`,
};

export const Default = {};

export const NoCaption = {
  args: {
    caption: '',
  },
};

export const Highlight = {
  args: {
    width: 'highlight',
  },
};
