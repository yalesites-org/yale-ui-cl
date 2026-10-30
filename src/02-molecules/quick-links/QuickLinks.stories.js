import "./QuickLinks";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/cta/Cta";
import "../../01-atoms/image/ResponsiveImage";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme } from "../../../.storybook/story-helpers.js";

// A local stand-in for a photo so the story doesn't depend on a network image.
const placeholderImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><defs><linearGradient id="g" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient></defs><rect width="16" height="9" fill="url(#g)"/></svg>')}`;

export default {
  title: 'Molecules/Quick Links',
  component: 'ycl-quick-links',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variation: attributeArg('promotional adds a colored background; subtle leaves it plain.', {
      control: 'select',
      options: ['promotional', 'subtle'],
    }),
    theme: attributeArg('Color theme.', { name: 'Component Theme', control: 'select', options: ['one', 'two', 'three'] }),
    heading: slotArg('Heading (slot="heading"). Omitted when empty.', { control: 'text' }),
    description: slotArg('Description (slot="description"). A description switches the layout from stacked to side by side. Omitted when empty.', {
      control: 'text',
    }),
    image: slotArg('Image (slot="image").', { name: 'With image', control: 'boolean' }),
    links: slotArg('Every other child is a link and gets its own list item.', { control: false }),
    globalTheme: globalThemeArgType,
  },
  args: {
    heading: 'Heading for Quick Links',
    description: 'This is a Quick Links description.',
    image: true,
    variation: 'promotional',
    theme: 'one',
    globalTheme: 'one',
  },

  render: (args) => withGlobalTheme(args.globalTheme, `
      <ycl-quick-links${attrs({ theme: args.theme, variation: args.variation })}>
        ${args.heading ? `<ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : ''}
        ${args.description ? `<p slot="description">${args.description}</p>` : ''}
        ${args.image ? `<ycl-image slot="image"><img src="${placeholderImage}" alt=""></ycl-image>` : ''}
        <cta-link class="outline" href="#">This is a link</cta-link>
        <cta-link class="outline" href="https://google.com">This is another link</cta-link>
        <cta-link class="outline" href="https://google.com/download.pdf">This is a very long link that will wrap lines</cta-link>
        <cta-link class="outline" href="#">Link #4</cta-link>
      </ycl-quick-links>`),
};

export const Default = {};
