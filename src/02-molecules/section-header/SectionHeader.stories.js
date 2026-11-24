import "./SectionHeader";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Molecules/Section Header',
  component: 'ycl-section-header',
  argTypes: {
    level: attributeArg('Heading level (1 to 6). Pick the one that fits the page outline; defaults to 2.', {
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6'],
    }),
    linkHref: attributeArg('link-href: URL of the link. The link shows only when it has an href and link text.', { name: 'Link href', control: 'text' }),
    heading: slotArg('Heading text (default slot). Omitted when empty.', { control: 'text' }),
    text: slotArg('Intro text (slot="text"). Omitted when empty.', { control: 'text' }),
    link: slotArg('Link text (slot="link"), for example "View all". Omitted when empty.', { control: 'text' }),
  },
  args: {
    level: '2',
    linkHref: '#',
    heading: 'Upcoming Events',
    text: 'Lectures, performances and talks happening across campus this month.',
    link: 'View all',
  },

  render: (args) =>
    `<ycl-section-header${attrs({ level: args.level, 'link-href': args.linkHref })}>
      ${args.heading ?? ''}
      ${args.text ? `<span slot="text">${args.text}</span>` : ''}
      ${args.link ? `<span slot="link">${args.link}</span>` : ''}
    </ycl-section-header>`,
};

export const Default = {};

export const HeadingOnly = {
  args: { text: '', link: '' },
};

export const HeadingAndLink = {
  args: { text: '' },
};

export const IntroOnly = {
  args: { heading: '', link: '' },
};
