import "./QuoteCallout";
import "../../01-atoms/image/ResponsiveImage";
import quoteImage from "../../assets/avif-test-image.avif";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Molecules/Quote Callout',
  component: 'ycl-quote-callout',
  argTypes: {
    variant: attributeArg('Accent bar, quote mark, or an image beside the quote (the image slot only shows for "image").', {
      name: 'Style',
      control: 'select',
      options: ['bar', 'quote', 'image'],
    }),
    quoteAlignment: attributeArg('quote-alignment: which side the accent sits on.', {
      name: 'Quote Alignment',
      control: 'select',
      options: ['left', 'right'],
    }),
    theme: attributeArg('Accent color.', {
      name: 'Accent Theme',
      control: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    }),
    quote: slotArg('The quote (default slot). Omitted when empty.', { control: 'text' }),
    attribution: slotArg('Who said it (slot="attribution"); the dash is hidden without one. Omitted when empty.', { control: 'text' }),
    image: slotArg('Image (slot="image"), shown only for variant="image".', { control: false }),
    globalTheme: globalThemeArgType,
  },
  args: {
    quote: 'Yale changed that thinking. It was evident in every class, every conversation, every project, that a business cannot exist in a vacuum, and that a business with the sole purpose of profit, with total disregard for its surroundings, will eventually fizzle out.',
    attribution: 'Annie Nymity',
    variant: 'bar',
    quoteAlignment: 'left',
    theme: 'one',
    globalTheme: 'one',
  },

  render: (args) => withGlobalTheme(args.globalTheme, `
      <ycl-quote-callout${attrs({ variant: args.variant, 'quote-alignment': args.quoteAlignment, theme: args.theme })}>
        <ycl-image slot="image" ratio="1x1"><img src="${quoteImage}" alt=""></ycl-image>
        ${args.quote ? `<p>${args.quote}</p>` : ''}
        ${args.attribution ? `<span slot="attribution">${args.attribution}</span>` : ''}
      </ycl-quote-callout>`),
};

export const Default = {};
