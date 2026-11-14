import "./BannerContent";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/cta/Cta";
import "../../01-atoms/text-link/Link";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";
import { COLOR_OPTION_DESCRIPTION, colorOptionLabels } from "../../00-tokens/theme/color-options.js";

const links = (args) => {
  if (args.linkStyle === 'none') return '';
  const [first, second] = args.linkStyle === 'text-link'
    ? ['<ycl-text-link slot="actions" href="https://google.com">', '<ycl-text-link slot="actions" href="https://yale.edu">']
    : ['<ycl-cta-link slot="actions" variant="filled" href="https://google.com">', '<ycl-cta-link slot="actions" variant="outline" href="https://yale.edu">'];
  const tag = args.linkStyle === 'text-link' ? 'ycl-text-link' : 'ycl-cta-link';
  return [
    args.linkContent ? `${first}${args.linkContent}</${tag}>` : '',
    args.linkContentTwo ? `${second}${args.linkContentTwo}</${tag}>` : '',
  ].filter(Boolean).join('\n        ');
};

export default {
  title: 'Molecules/Banner Content',
  component: 'ycl-banner-content',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: attributeArg(COLOR_OPTION_DESCRIPTION, {
      name: 'Color Option',
      options: ['primary', 'secondary', 'tertiary', 'accent-1', 'accent-2'],
      control: { type: 'select', labels: colorOptionLabels('ycl-banner-content') },
    }),
    placement: attributeArg('How wide the content may be. contained is a box of its own width, as when it overlays part of a banner; full spans the banner. Defaults to contained.', {
      name: 'Placement',
      control: 'select',
      options: ['contained', 'full'],
    }),
    buttonAlignment: attributeArg('button-alignment: alignment of the actions. Defaults to left.', {
      name: 'Button Alignment',
      control: 'select',
      options: ['left', 'center', 'right'],
    }),
    heading: slotArg('Heading (slot="heading"), usually a ycl-heading. Omitted when empty.', { control: 'text' }),
    snippet: slotArg('Text (default slot). Omitted when empty.', { control: 'text' }),
    linkStyle: slotArg('What goes in slot="actions": ycl-cta-link buttons, ycl-text-link links, or nothing.', {
      name: 'Link Style',
      control: 'select',
      options: ['cta', 'text-link', 'none'],
    }),
    linkContent: slotArg('First action text (slot="actions"). Omitted when empty.', { control: 'text' }),
    linkContentTwo: slotArg('Second action text (slot="actions"). Omitted when empty.', { control: 'text' }),
  },
  args: {
    heading: 'Heading for the Banner',
    snippet: 'Text option, in case there is more that needs to be said.',
    linkContent: 'This is a link',
    linkContentTwo: 'This is another link',
    theme: 'primary',
    linkStyle: 'cta',
    placement: 'contained',
    buttonAlignment: 'left',
  },

  render: (args) => `
      <ycl-banner-content${attrs({
        theme: args.theme,
        placement: args.placement,
        'button-alignment': args.buttonAlignment,
      })}>${args.heading ? `
        <ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : ''}${args.snippet ? `
        <p>${args.snippet}</p>` : ''}
        ${links(args)}
      </ycl-banner-content>`,
};

export const Default = {};

export const FullWidth = {
  args: { placement: 'full' },
};
