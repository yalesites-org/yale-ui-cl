import "./PullQuote";

export default {
  title: 'Molecules/Pull Quote',
  component: 'ycl-pull-quote',
  argTypes: {
    quote: {control: 'text'},
    attribution: {control: 'text'},
    variant: {
      name: 'Style',
      type: 'select',
      options: ['bar-left', 'bar-right', 'quote-left'],
    },
    theme: {
      name: 'Color Option',
      type: 'select',
      options: ['primary', 'tertiary', 'accent-2'],
    },
  },
  args: {
    quote: 'Yale changed that thinking. It was evident in every class, every conversation, every project, that a business cannot exist in a vacuum, and that a business with the sole purpose of profit, with total disregard for its surroundings, will eventually fizzle out.',
    attribution: 'Annie Nymity',
    variant: 'bar-left',
    theme: 'primary',
  },

  render: (args) =>
    `<ycl-pull-quote variant="${args.variant}" theme="${args.theme}">
      <p>${args.quote}</p>
      <span slot="attribution">${args.attribution}</span>
    </ycl-pull-quote>`,
};

export const Default = {};

export const BarRight = {
  args: {
    variant: 'bar-right',
  },
};

export const QuoteLeft = {
  args: {
    variant: 'quote-left',
  },
};

export const Themed = {
  args: {
    theme: 'accent-2',
  },
};
