import "./Callout";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/cta/Cta";
import "../../01-atoms/text-link/Link";
import overlayImage from "../../assets/avif-test-image.avif";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme } from "../../../.storybook/story-helpers.js";

const link = (args) => {
  if (!args.linkText) return '';
  return args.linkType === 'link'
    ? `<text-link slot="link" href="https://www.yale.edu">${args.linkText}</text-link>`
    : `<cta-link slot="link" class="outline" href="https://www.yale.edu">${args.linkText}</cta-link>`;
};

const item = (args) => `
  <ycl-callout-item>${args.heading ? `
    <ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : ''}${args.text ? `
    <p>${args.text}</p>` : ''}
    ${link(args)}
  </ycl-callout-item>`;

const callout = (args, items) => withGlobalTheme(args.globalTheme, `
      <ycl-callout${attrs({ theme: args.theme, alignment: args.alignment, 'overlay-image': args.overlay && overlayImage })}>
        ${items}
      </ycl-callout>`);

export default {
  title: 'Molecules/Callout',
  component: 'ycl-callout',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: attributeArg('Component theme.', {
      name: 'Component Theme',
      control: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    }),
    alignment: attributeArg('Content alignment. Defaults to center.', {
      name: 'Callout Alignment',
      control: 'select',
      options: ['center', 'left'],
    }),
    overlay: attributeArg('overlay-image: URL of an image drawn behind the callouts. Shown here with a sample image.', {
      name: 'Overlay Background Image',
      control: 'boolean',
    }),
    items: slotArg('ycl-callout-item elements (default slot). Each item takes slot="heading", text in its default slot and slot="link".', {
      control: false,
    }),
    heading: slotArg('Item heading (slot="heading" on ycl-callout-item). Omitted when empty.', { control: 'text' }),
    text: slotArg('Item text (default slot of ycl-callout-item). Omitted when empty.', { control: 'text' }),
    linkText: slotArg('Item link (slot="link" on ycl-callout-item). Omitted when empty.', { name: 'Link Text', control: 'text' }),
    linkType: slotArg('Whether the item link is a cta-link or a text-link.', {
      name: 'Link Type',
      control: 'select',
      options: ['cta', 'link'],
    }),
    globalTheme: globalThemeArgType,
  },
  args: {
    heading: 'Degree Programs',
    text: 'Designed for those who intend to pursue graduate and those who wish to immediately enter a career in which broad scientific training is beneficial.',
    linkText: 'Programs',
    linkType: 'cta',
    theme: 'one',
    alignment: 'center',
    overlay: false,
    globalTheme: 'one',
  },

  render: (args) => callout(args, item(args)),
};

export const Default = {};

export const Double = {
  parameters: {
    docs: {
      description: {
        story: 'Two callout items side by side in one callout. Controls edit a single item, so they cannot add a second one.',
      },
    },
  },
  render: (args) => callout(args, `${item(args)}
        ${item({...args, heading: 'Research Opportunities', text: 'Work alongside faculty on projects spanning the sciences, humanities, and social sciences.', linkText: 'Find a lab'})}`),
};
