import "./TextCopyButton";
export default {
  title: 'Text Copy Button',
  component: 'ycl-text-copy-button',
  argTypes: {
    text: {control: 'text'},
    content: {control: 'text'},
    basicTheme: {
      name: 'Section Basic Theme',
      type: 'select',
      options: ['none', 'blue-yale', 'gray-200', 'gray-700', 'gray-800'],
    },
    globalTheme: {
      name: 'Site Global Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
  },
  args: {
    text: 'person@example.com',
    content: '(copy)',
    basicTheme: 'none',
    globalTheme: 'one',
  },

  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <div ${args.basicTheme !== 'none'
        // The library has no basic-theme section styles, so the story paints the background itself.
        ? `data-basic-theme="${args.basicTheme}" style="padding: 1rem; background-color: var(--basic-themes-${args.basicTheme}-background); color: var(--basic-themes-${args.basicTheme}-text);"`
        : 'style="padding: 1rem;"'}>
        <ycl-text-copy-button>
          <span slot="text">${args.text}</span>
          ${args.content}
        </ycl-text-copy-button>
      </div>
    </div>`,
};

export const Default = {};

// Block-level source text, e.g. a citation pulled from a rich-text field.
export const RichText = {
  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-text-copy-button>
        <div slot="text"><p>Adams, J. (2026). <em>The Department of Government Improvement</em>. Yale Institution for Social and Policy Studies.</p></div>
        Copy citation
      </ycl-text-copy-button>
    </div>`,
};

export const DarkSection = {
  args: {
    basicTheme: 'blue-yale',
  },
};
