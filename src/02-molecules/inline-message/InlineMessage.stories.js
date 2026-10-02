import "./InlineMessage";
import "../../01-atoms/text-link/Link";

export default {
  title: 'Inline Message',
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
    heading: {control: 'text'},
    content: {control: 'text'},
    linkContent: {name: 'Link Text', control: 'text'},
    theme: {
      name: 'Component Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
    globalTheme: {
      name: 'Site Global Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
  },
  args: {
    type: 'general',
    icon: 'default',
    heading: 'This is a general message heading',
    content: 'This is a general message content',
    linkContent: 'This is a link',
    theme: 'one',
    globalTheme: 'one',
  },

  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-inline-message type="${args.type}" theme="${args.theme}"${args.icon === 'none' ? ' icon="none"' : ''}>
        <h2 slot="heading">${args.heading}</h2>
        <p>${args.content}</p>
        <text-link slot="link" href="#">${args.linkContent}</text-link>
      </ycl-inline-message>
    </div>`,
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
    theme: 'three',
  },
};
