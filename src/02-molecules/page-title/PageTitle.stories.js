import "./PageTitle";
import "../../01-atoms/text-link/Link";
import "../../01-atoms/date-time/DateTime";
import "../../01-atoms/image/ResponsiveImage";
import { attrs, attributeArg, slotArg, placeholder } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Molecules/Page Title',
  component: 'ycl-page-title',
  argTypes: {
    prefix: attributeArg('Prefix shown before the heading text.', { control: 'text' }),
    width: attributeArg('How wide the title runs.', {
      name: 'Width',
      control: 'select',
      options: ['site', 'highlight', 'content', 'max'],
    }),
    variation: attributeArg('variation="event" lays the title out beside an image (slot="image").', {
      control: 'select',
      options: ['default', 'event'],
      mapping: { default: undefined },
    }),
    display: attributeArg('visually-hidden keeps the title for screen readers but hides it on screen; hidden hides it entirely.', {
      control: 'select',
      options: ['default', 'visually-hidden', 'hidden'],
      mapping: { default: undefined },
    }),
    heading: slotArg('Heading text (default slot), always rendered as the page\'s h1.', { control: 'text' }),
    overline: slotArg('Text above the heading (slot="overline"). Omitted when empty.', { control: 'text' }),
    showMeta: slotArg('Byline and date (slot="meta").', { name: 'Meta', control: 'boolean' }),
    showImage: slotArg('Image (slot="image"), used by the event variation.', { name: 'Image', control: 'boolean' }),
    socialLinks: slotArg('Share links (slot="social-links").', { name: 'Social Links', control: 'boolean' }),
    otherSlots: slotArg('slot="extra" sits under the heading; slot="meta-extra" under the meta.', {
      name: 'extra, meta-extra',
      control: false,
    }),
  },
  args: {
    heading: 'Davis Team Project Wins Award for Research',
    prefix: '',
    overline: '',
    width: 'site',
    variation: 'default',
    display: 'default',
    showMeta: true,
    showImage: false,
    socialLinks: false,
  },

  render: (args) =>
    `<ycl-page-title${attrs({
      width: args.width,
      prefix: args.prefix,
      variation: args.variation,
      display: args.display,
    })}>
      ${args.heading ?? ''}
      ${args.overline ? `<span slot="overline">${args.overline}</span>` : ''}
      ${args.showImage ? `<ycl-image slot="image" ratio="16x9"><img src="${placeholder(16, 9, '')}" alt="Graduates gathered on Old Campus"></ycl-image>` : ''}
      ${args.showMeta ? `<span slot="meta">By Charlyn Paradis</span>
      <ycl-date-time slot="meta" start="2022-01-25T12:00:00" format="date"></ycl-date-time>` : ''}
      ${args.socialLinks ? `<div slot="social-links" style="display: flex; gap: 1rem;">
        <text-link href="https://www.facebook.com/sharer/sharer.php">Share on Facebook</text-link>
        <text-link href="https://www.linkedin.com/sharing/share-offsite/">Share on LinkedIn</text-link>
      </div>` : ''}
    </ycl-page-title>`,
};

export const Default = {};
