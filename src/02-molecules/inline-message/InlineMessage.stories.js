import "./InlineMessage";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/text-link/Link";
import "../../01-atoms/icons/Icon";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";
import { COLOR_OPTION_DESCRIPTION, colorOptionLabels } from "../../00-tokens/theme/color-options.js";

export default {
  title: 'Molecules/Inline Message',
  component: 'ycl-inline-message',
  argTypes: {
    type: attributeArg('Message type; sets the default icon.', {
      name: 'Type',
      control: 'select',
      options: ['general', 'marketing'],
    }),
    icon: attributeArg('icon="none" hides the icon for a text-only message.', {
      name: 'Icon',
      control: 'select',
      options: ['default', 'none'],
      mapping: { default: undefined },
    }),
    label: attributeArg('Accessible name of the message\'s landmark. Give each message on a page its own; defaults to "information".', {
      name: 'Label',
      control: 'text',
    }),
    theme: attributeArg(COLOR_OPTION_DESCRIPTION, {
      name: 'Color Option',
      options: ['primary', 'secondary', 'tertiary', 'accent-1', 'accent-2'],
      control: { type: 'select', labels: colorOptionLabels('ycl-inline-message') },
    }),
    customIcon: slotArg('A ycl-icon name slotted (slot="icon") in place of the type\'s default icon.', { name: 'Custom Icon', control: 'text' }),
    heading: slotArg('Heading (slot="heading"). Omitted when empty.', { control: 'text' }),
    content: slotArg('Message text (default slot). Omitted when empty.', { control: 'text' }),
    linkContent: slotArg('Link (slot="link"). Omitted when empty.', { name: 'Link Text', control: 'text' }),
  },
  args: {
    type: 'general',
    icon: 'default',
    label: '',
    customIcon: '',
    heading: 'This is a general message heading',
    content: 'This is a general message content',
    linkContent: 'This is a link',
    theme: 'accent-1',
  },

  render: (args) => `
      <ycl-inline-message${attrs({ type: args.type, theme: args.theme, icon: args.icon, label: args.label })}>
        ${args.customIcon ? `<ycl-icon slot="icon" name="${args.customIcon}"></ycl-icon>` : ''}
        ${args.heading ? `<ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : ''}
        ${args.content ? `<p>${args.content}</p>` : ''}
        ${args.linkContent ? `<ycl-text-link slot="link" href="#">${args.linkContent}</ycl-text-link>` : ''}
      </ycl-inline-message>`,
};

export const Default = {};

// Two messages on one page, each with its own landmark name so screen reader users can tell them apart.
export const TwoLabeledMessages = {
  name: 'Two Labeled Messages',
  parameters: { controls: { disable: true } },
  render: () => `
      <div style="display: grid; gap: var(--size-spacing-5);">
        <ycl-inline-message label="Parking update">
          <ycl-heading level="2" slot="heading">Lot C closes Friday</ycl-heading>
          <p>Use Lot D on Friday while Lot C is repaved.</p>
        </ycl-inline-message>
        <ycl-inline-message type="marketing" label="Library hours">
          <ycl-heading level="2" slot="heading">Extended hours during finals</ycl-heading>
          <p>The library stays open until 2 a.m. through December 18.</p>
        </ycl-inline-message>
      </div>`,
};
