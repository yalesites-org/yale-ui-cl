import "./TextCopyButton";
import { slotArg, eventArg, globalThemeArgType, withGlobalTheme } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Atoms/Text Copy Button',
  component: 'ycl-text-copy-button',
  argTypes: {
    text: slotArg('slot="text": the text that gets copied, shown before the button.', { control: 'text' }),
    content: slotArg('Button label (default slot). Defaults to "Copy" when empty.', { control: 'text' }),
    copied: eventArg('Fired (bubbling, composed, cancelable) after a successful copy; detail is { text, button }. preventDefault() suppresses the visible label swap.', {
      name: 'text-copy-button:copied',
    }),
    basicTheme: {
      name: 'Section Basic Theme',
      control: 'select',
      options: ['none', 'blue-yale', 'gray-200', 'gray-700', 'gray-800'],
      mapping: { none: undefined },
      description: 'Basic theme of the section around the button (set on a wrapper).',
      table: { category: 'Page context' },
    },
    globalTheme: globalThemeArgType,
  },
  args: {
    text: 'person@example.com',
    content: '(copy)',
    basicTheme: 'none',
    globalTheme: 'one',
  },

  render: (args) => {
    // The library has no basic-theme section styles, so the story paints the background itself.
    const section = args.basicTheme
      ? `data-basic-theme="${args.basicTheme}" style="padding: 1rem; background-color: var(--basic-themes-${args.basicTheme}-background); color: var(--basic-themes-${args.basicTheme}-text);"`
      : 'style="padding: 1rem;"';
    return withGlobalTheme(args.globalTheme, `
      <div ${section}>
        <ycl-text-copy-button>
          <span slot="text">${args.text ?? ''}</span>
          ${args.content ?? ''}
        </ycl-text-copy-button>
      </div>`);
  },
};

export const Default = {};

export const RichText = {
  parameters: {
    docs: {
      description: {
        story: 'Block-level source text (a citation pulled from a rich-text field) in the text slot instead of a short inline span. That is different slotted markup, which a text control cannot produce.',
      },
    },
  },
  render: (args) =>
    withGlobalTheme(args.globalTheme, `
      <ycl-text-copy-button>
        <div slot="text"><p>Adams, J. (2026). <em>The Department of Government Improvement</em>. Yale Institution for Social and Policy Studies.</p></div>
        Copy citation
      </ycl-text-copy-button>`),
};
