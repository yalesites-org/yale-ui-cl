import "./QuickLinks";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/cta/Cta";
import "../../01-atoms/image/ResponsiveImage";

// A local stand-in for a photo so the story doesn't depend on a network image.
const placeholderImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs><rect width="16" height="9" fill="url(#g)"/></svg>')}`;

export default {
  title: 'Molecules/Quick Links',
  component: 'ycl-quick-links',
  parameters: {
    yalesites: { name: 'Quick Links', story: 'molecules-quick-links--quick-links' },
    layout: 'fullscreen',
  },
  argTypes: {
    heading: {control: 'text'},
    description: {control: 'text'},
    image: {name: 'With image', control: 'boolean'},
    variation: {
      type: 'select',
      options: ['promotional', 'subtle'],
    },
    theme: {
      name: 'Component Theme',
      type: 'select',
      options: ['one', 'two', 'three'],
    },
    globalTheme: {
      name: 'Site Global Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
},
  args: {
    heading: 'Heading for Quick Links',
    description: 'This is a Quick Links description.',
    image: true,
    variation: 'promotional',
    theme: 'one',
    globalTheme: 'one',
},

  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-quick-links theme="${args.theme}" variation="${args.variation}">
        <ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>
        ${args.description ? `<p slot="description">${args.description}</p>` : ''}
        ${args.image ? `<ycl-image slot="image"><img src="${placeholderImage}" alt=""></ycl-image>` : ''}
        <cta-link class="outline" href="#">This is a link</cta-link>
        <cta-link class="outline" href="https://google.com">This is another link</cta-link>
        <cta-link class="outline" href="https://google.com/download.pdf">This is a very long link that will wrap lines</cta-link>
        <cta-link class="outline" href="#">Link #4</cta-link>
      </ycl-quick-links>
    </div>`,
};

export const Default = {};

export const Stacked = {
  args: {
    description: '',
  },
};

export const Subtle = {
  args: {
    variation: 'subtle',
    image: false,
  },
};

export const ThemeTwo = {
  args: {
    theme: 'two',
  },
};
