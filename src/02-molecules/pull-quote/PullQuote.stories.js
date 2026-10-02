import "./PullQuote";

export default {
  title: 'Pull Quote',
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
      name: 'Accent Theme',
      type: 'select',
      options: ['one', 'two', 'three'],
    },
    globalTheme: {
      name: 'Site Global Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
  },
  args: {
    quote: 'Yale changed that thinking. It was evident in every class, every conversation, every project, that a business cannot exist in a vacuum, and that a business with the sole purpose of profit, with total disregard for its surroundings, will eventually fizzle out.',
    attribution: 'Annie Nymity',
    variant: 'bar-left',
    theme: 'one',
    globalTheme: 'one',
  },

  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-pull-quote variant="${args.variant}" theme="${args.theme}">
        <p>${args.quote}</p>
        <span slot="attribution">${args.attribution}</span>
      </ycl-pull-quote>
    </div>`,
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
    theme: 'three',
  },
};
