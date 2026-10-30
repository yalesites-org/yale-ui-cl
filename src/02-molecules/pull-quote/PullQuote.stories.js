import "./PullQuote";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Molecules/Pull Quote',
  component: 'ycl-pull-quote',
  argTypes: {
    variant: attributeArg('Accent bar on the left or right, or a quote mark on the left.', {
      name: 'Style',
      control: 'select',
      options: ['bar-left', 'bar-right', 'quote-left'],
    }),
    theme: attributeArg('Accent color.', { name: 'Accent Theme', control: 'select', options: ['one', 'two', 'three'] }),
    quote: slotArg('The quote (default slot). Omitted when empty.', { control: 'text' }),
    attribution: slotArg('Who said it (slot="attribution"); the dash is hidden without one. Omitted when empty.', { control: 'text' }),
    globalTheme: globalThemeArgType,
  },
  args: {
    quote: 'Yale changed that thinking. It was evident in every class, every conversation, every project, that a business cannot exist in a vacuum, and that a business with the sole purpose of profit, with total disregard for its surroundings, will eventually fizzle out.',
    attribution: 'Annie Nymity',
    variant: 'bar-left',
    theme: 'one',
    globalTheme: 'one',
  },

  render: (args) => withGlobalTheme(args.globalTheme, `
      <ycl-pull-quote${attrs({ variant: args.variant, theme: args.theme })}>
        ${args.quote ? `<p>${args.quote}</p>` : ''}
        ${args.attribution ? `<span slot="attribution">${args.attribution}</span>` : ''}
      </ycl-pull-quote>`),
};

export const Default = {};
