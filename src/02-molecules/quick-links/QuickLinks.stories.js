import "./QuickLinks";

// A local stand-in for a photo so the story doesn't depend on a network image.
const placeholderImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs><rect width="16" height="9" fill="url(#g)"/></svg>')}`;

export default {
  title: 'Quick Links',
  component: 'ycl-quick-links',
  parameters: {
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
        <h2 slot="heading">${args.heading}</h2>
        ${args.description ? `<p slot="description">${args.description}</p>` : ''}
        ${args.image ? `<img slot="image" src="${placeholderImage}" alt="">` : ''}
        <a href="#">This is a link</a>
        <a href="https://google.com">This is another link</a>
        <a href="https://google.com/download.pdf">This is a very long link that will wrap lines</a>
        <a href="#">Link #4</a>
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
