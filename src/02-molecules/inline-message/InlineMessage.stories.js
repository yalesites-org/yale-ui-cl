import "./InlineMessage";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/text-link/Link";
import "../../01-atoms/icons/Icon";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme } from "../../../.storybook/story-helpers.js";

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
    theme: attributeArg('Color theme.', {
      name: 'Component Theme',
      control: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    }),
    customIcon: slotArg('A ycl-icon name slotted (slot="icon") in place of the type\'s default icon.', { name: 'Custom Icon', control: 'text' }),
    heading: slotArg('Heading (slot="heading"). Omitted when empty.', { control: 'text' }),
    content: slotArg('Message text (default slot). Omitted when empty.', { control: 'text' }),
    linkContent: slotArg('Link (slot="link"). Omitted when empty.', { name: 'Link Text', control: 'text' }),
    globalTheme: globalThemeArgType,
  },
  args: {
    type: 'general',
    icon: 'default',
    customIcon: '',
    heading: 'This is a general message heading',
    content: 'This is a general message content',
    linkContent: 'This is a link',
    theme: 'one',
    globalTheme: 'one',
  },

  render: (args) => withGlobalTheme(args.globalTheme, `
      <ycl-inline-message${attrs({ type: args.type, theme: args.theme, icon: args.icon })}>
        ${args.customIcon ? `<ycl-icon slot="icon" name="${args.customIcon}"></ycl-icon>` : ''}
        ${args.heading ? `<ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : ''}
        ${args.content ? `<p>${args.content}</p>` : ''}
        ${args.linkContent ? `<text-link slot="link" href="#">${args.linkContent}</text-link>` : ''}
      </ycl-inline-message>`),
};

export const Default = {};
