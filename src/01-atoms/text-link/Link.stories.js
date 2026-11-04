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
    label: slotArg('Link text (default slot).', { control: 'text' }),
  },
  args: {
    label: 'Yale HomePage',
    URL: 'https://www.yale.edu',
    target: '',
  },
  render: (args) =>
    `<ycl-text-link${attrs({ href: args.URL, target: args.target })}>${args.label ?? ''}</ycl-text-link>`,
};

export const Default = {};
