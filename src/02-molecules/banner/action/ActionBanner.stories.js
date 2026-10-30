import "./ActionBanner";
import "../../../01-atoms/headings/Heading";
import "../../../01-atoms/cta/Cta";
import "../../../01-atoms/text-link/Link";
import "../../../01-atoms/image/ResponsiveImage";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme } from "../../../../.storybook/story-helpers.js";

// Inline placeholders so the story doesn't depend on hosted images.
const placeholderImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#978d85"/><text x="800" y="450" font-family="sans-serif" font-size="96" fill="#fff" text-anchor="middle" dominant-baseline="middle">16 x 9</text></svg>')}`;
const patternImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><path d="M0 10 Q10 0 20 10 T40 10" fill="none" stroke="#000" stroke-width="3"/></svg>')}`;

const links = (args) => {
  if (args.linkStyle === 'none') return '';
  const [first, second] = args.linkStyle === 'text-link'
    ? ['<text-link slot="actions" href="https://google.com">', '<text-link slot="actions" href="https://yale.edu">']
    : ['<cta-link slot="actions" class="filled" href="https://google.com">', '<cta-link slot="actions" class="outline" href="https://yale.edu">'];
  const tag = args.linkStyle === 'text-link' ? 'text-link' : 'cta-link';
  return [
    args.linkContent ? `${first}${args.linkContent}</${tag}>` : '',
    args.linkContentTwo ? `${second}${args.linkContentTwo}</${tag}>` : '',
  ].filter(Boolean).join('\n        ');
};

export default {
  title: 'Molecules/Banners/Action Banner',
  component: 'ycl-action-banner',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: attributeArg('Component theme. Defaults to one.', {
      name: 'Component Theme',
      control: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    }),
    layout: attributeArg('Where the content sits over the image. Defaults to bottom.', {
      name: 'Content Layout',
      control: 'select',
      options: ['bottom', 'left', 'right'],
    }),
    buttonAlignment: attributeArg('button-alignment: alignment of the actions. Defaults to right for the bottom layout, left otherwise.', {
      name: 'Button Alignment',
      control: 'select',
      options: ['left', 'center', 'right'],
    }),
    width: attributeArg('Site width or full bleed. Defaults to site.', {
      name: 'Banner Width',
      control: 'select',
      options: ['site', 'full'],
    }),
    overlay: attributeArg('overlay-image: URL of a pattern drawn over the content background. Shown here with a sample pattern.', {
      name: 'Overlay Background Image',
      control: 'boolean',
    }),
    heading: slotArg('Banner heading (slot="heading"). Omitted when empty.', { control: 'text' }),
    snippet: slotArg('Banner text (default slot). Omitted when empty.', { control: 'text' }),
    image: slotArg('Background image (slot="image"), usually a ycl-image.', { control: false }),
    linkStyle: slotArg('What goes in slot="actions": cta-link buttons, text links, or nothing.', {
      name: 'Link Style',
      control: 'select',
      options: ['cta', 'text-link', 'none'],
    }),
    linkContent: slotArg('First action text (slot="actions"). Omitted when empty.', { control: 'text' }),
    linkContentTwo: slotArg('Second action text (slot="actions"). Omitted when empty.', { control: 'text' }),
    globalTheme: globalThemeArgType,
  },
  args: {
    heading: 'Heading for the Banner',
    snippet: 'Text option, in case there is more that needs to be said.',
    linkContent: 'This is a link',
    linkContentTwo: 'This is another link',
    theme: 'one',
    globalTheme: 'one',
    linkStyle: 'cta',
    layout: 'bottom',
    buttonAlignment: 'right',
    overlay: false,
    width: 'site',
  },

  render: (args) => withGlobalTheme(args.globalTheme, `
      <ycl-action-banner${attrs({
        theme: args.theme,
        layout: args.layout,
        'button-alignment': args.buttonAlignment,
        width: args.width,
        'overlay-image': args.overlay && patternImage,
      })}>
        <ycl-image slot="image"><img src="${placeholderImage}" alt="A 16 by 9 image"></ycl-image>${args.heading ? `
        <ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : ''}${args.snippet ? `
        <p>${args.snippet}</p>` : ''}
        ${links(args)}
      </ycl-action-banner>`),
};

export const Default = {};
