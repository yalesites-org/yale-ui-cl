import "./QuickLinks";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/cta/Cta";
import "../../01-atoms/image/ResponsiveImage";
import { COLOR_OPTION_DESCRIPTION, colorOptionLabels } from "../../00-tokens/theme/color-options.js";

// A local stand-in for a photo so the story doesn't depend on a network image.
const placeholderImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs><rect width="16" height="9" fill="url(#g)"/></svg>')}`;

export default {
  title: 'Molecules/Quick Links',
  component: 'ycl-quick-links',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    heading: {control: 'text'},
    description: {control: 'text'},
    image: {name: 'With image', control: 'boolean'},
    variant: {
      type: 'select',
      options: ['promotional', 'subtle'],
    },
    theme: {
      name: 'Color Option',
      description: COLOR_OPTION_DESCRIPTION,
      options: ['primary', 'accent-1', 'accent-2'],
      control: { type: 'select', labels: colorOptionLabels('ycl-quick-links') },
    },
},
  args: {
    heading: 'Heading for Quick Links',
    description: 'This is a Quick Links description.',
    image: true,
    variant: 'promotional',
    theme: 'primary',
},

  render: (args) =>
    `<ycl-quick-links theme="${args.theme}" variant="${args.variant}">
      <ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>
      ${args.description ? `<p slot="description">${args.description}</p>` : ''}
      ${args.image ? `<ycl-image slot="image"><img src="${placeholderImage}" alt=""></ycl-image>` : ''}
      <ycl-cta-link variant="outline" href="#">This is a link</ycl-cta-link>
      <ycl-cta-link variant="outline" href="https://google.com">This is another link</ycl-cta-link>
      <ycl-cta-link variant="outline" href="https://google.com/download.pdf">This is a very long link that will wrap lines</ycl-cta-link>
      <ycl-cta-link variant="outline" href="#">Link #4</ycl-cta-link>
    </ycl-quick-links>`,
};

export const Default = {};

export const Stacked = {
  args: {
    description: '',
  },
};

export const Subtle = {
  args: {
    variant: 'subtle',
    image: false,
  },
};

export const Accent1 = {
  name: 'Accent 1',
  args: {
    theme: 'accent-1',
  },
};
