import "./QuoteCallout";
import "../../01-atoms/image/ResponsiveImage";
import quoteImage from "../../assets/avif-test-image.avif";

export default {
  title: 'Molecules/Quote Callout',
  component: 'ycl-quote-callout',
  argTypes: {
    quote: {control: 'text'},
    attribution: {control: 'text'},
    variant: {
      name: 'Style',
      type: 'select',
      options: ['bar', 'quote', 'image'],
    },
    quoteAlignment: {
      name: 'Quote Alignment',
      type: 'select',
      options: ['left', 'right'],
    },
    theme: {
      name: 'Color Option',
      type: 'select',
      options: ['primary', 'tertiary', 'accent-2', 'accent-1', 'secondary'],
    },
  },
  args: {
    quote: 'Yale changed that thinking. It was evident in every class, every conversation, every project, that a business cannot exist in a vacuum, and that a business with the sole purpose of profit, with total disregard for its surroundings, will eventually fizzle out.',
    attribution: 'Annie Nymity',
    variant: 'bar',
    quoteAlignment: 'left',
    theme: 'primary',
  },

  render: (args) =>
    `<ycl-quote-callout variant="${args.variant}" quote-alignment="${args.quoteAlignment}" theme="${args.theme}">
      <ycl-image slot="image" ratio="1x1"><img src="${quoteImage}" alt=""></ycl-image>
      <p>${args.quote}</p>
      <span slot="attribution">${args.attribution}</span>
    </ycl-quote-callout>`,
};

export const Default = {};

export const QuoteMark = {
  args: {
    variant: 'quote',
  },
};

export const RightAligned = {
  args: {
    quoteAlignment: 'right',
  },
};

export const WithImage = {
  args: {
    variant: 'image',
  },
};

export const Themed = {
  args: {
    theme: 'tertiary',
  },
};
