import "./InlineMessage";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/text-link/Link";
import "../../01-atoms/icons/Icon";

export default {
  title: 'Molecules/Inline Message',
  component: 'ycl-inline-message',
  argTypes: {
    type: {
      name: 'Type',
      type: 'select',
      options: ['general', 'marketing'],
    },
    icon: {
      name: 'Icon',
      type: 'select',
      options: ['default', 'none'],
    },
    customIcon: {
      name: 'Custom Icon',
      control: 'text',
      description: 'A ycl-icon name slotted in place of the type\'s default icon.',
    },
    heading: {control: 'text'},
    content: {control: 'text'},
    linkContent: {name: 'Link Text', control: 'text'},
    theme: {
      name: 'Color Option',
      type: 'select',
      options: ['accent-1', 'primary', 'secondary', 'tertiary', 'accent-2'],
    },
  },
  args: {
    type: 'general',
    icon: 'default',
    customIcon: '',
    heading: 'This is a general message heading',
    content: 'This is a general message content',
    linkContent: 'This is a link',
    theme: 'accent-1',
  },

  render: (args) =>
    `<ycl-inline-message type="${args.type}" theme="${args.theme}"${args.icon === 'none' ? ' icon="none"' : ''}>
      ${args.customIcon ? `<ycl-icon slot="icon" name="${args.customIcon}"></ycl-icon>` : ''}
      <ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>
      <p>${args.content}</p>
      <text-link slot="link" href="#">${args.linkContent}</text-link>
    </ycl-inline-message>`,
};

export const Default = {};

export const Marketing = {
  args: {
    type: 'marketing',
    heading: 'Applications for fall are now open',
    content: 'Explore programs and submit your application before the December deadline.',
  },
};

export const TextOnly = {
  args: {
    icon: 'none',
  },
};

export const Themed = {
  args: {
    theme: 'secondary',
  },
};

export const CustomIcon = {
  args: {
    customIcon: 'lightbulb-solid',
  },
};
