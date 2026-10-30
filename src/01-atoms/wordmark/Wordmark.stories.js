import "./Wordmark";
export default {
  title: 'Atoms/Wordmark',
  component: 'ycl-wordmark',
  argTypes: {
    href: { name: 'Link (empty for no link)', control: { type: 'text' } },
    color: {
      name: 'Color',
      control: { type: 'select' },
      options: ['blue-yale', 'white'],
    },
  },
  args: {
    href: 'https://www.yale.edu',
    color: 'blue-yale',
  },
  // White is for dark backgrounds, so it's shown on Yale blue.
  render: (args) => {
    const href = args.href === undefined ? '' : ` href="${args.href}"`;
    const wordmark = `<ycl-wordmark${href} color="${args.color}"></ycl-wordmark>`;
    return args.color === 'white'
      ? `<div style="background: var(--color-blue-yale); padding: 1rem;">${wordmark}</div>`
      : wordmark;
  },
};

export const Default = {};
