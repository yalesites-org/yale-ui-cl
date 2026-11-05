import "./Link";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Atoms/Text Link',
  component: 'ycl-text-link',
  argTypes: {
    URL: attributeArg('href: link destination. External links and file downloads (e.g. .pdf) get an icon and a screen-reader note.', {
      control: 'text',
    }),
    target: attributeArg('target: browsing context to open the link in. Omitted when empty.', {
      control: 'select',
      options: ['', '_self', '_blank'],
    }),
    linkStyle: attributeArg('link-style: underline treatment. "underline" (default), "no-underline" (the underline slides in on hover) or "no-animation" (a plain text underline that drops on hover).', {
      name: 'link-style',
      control: 'select',
      options: ['underline', 'no-underline', 'no-animation'],
    }),
    chevron: attributeArg('chevron: adds a decorative trailing chevron, which replaces the external/download icon.', {
      control: 'boolean',
    }),
    label: slotArg('Link text (default slot).', { control: 'text' }),
  },
  args: {
    label: 'Yale HomePage',
    URL: 'https://www.yale.edu',
    target: '',
    linkStyle: 'underline',
    chevron: false,
  },
  render: (args) =>
    `<ycl-text-link${attrs({ href: args.URL, target: args.target, 'link-style': args.linkStyle, chevron: args.chevron })}>${args.label ?? ''}</ycl-text-link>`,
};

export const Default = {};
