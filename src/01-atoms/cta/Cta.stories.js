import "./Cta";

// cta.css variants are prefixed (cta--animate-fade, cta--radius-pill), so the class names are
// built from the arg values, skipping "none".
const variantClasses = (args) => [
  args.fill,
  args.animate !== 'none' && `animate-${args.animate}`,
  args.radius !== 'none' && `radius-${args.radius}`,
].filter(Boolean).join(' ');

export default {
  title: 'Atoms/CTA',
  component: 'cta-link',
  argTypes: {
    label: {control: 'text'},
    URL: {control: 'text'},
    fill: {
      name: 'Fill Type',
      type: 'select',
      options: ['filled', 'outline'],
    },
    animate: {
      name: 'Animation Type',
      type: 'select',
      options: ['none', 'fade', 'rise', 'wipe'],
    },
    radius: {
      name: 'Radius Type',
      type: 'select',
      options: ['none', 'soft', 'pill'],
    },
  },
  args: {
    label: 'Yale HomePage',
    URL: 'https://www.yale.edu',
    fill: 'filled',
    animate: 'fade',
    radius: 'none',
  },

  render: (args) =>
    `<cta-link class="${variantClasses(args)}" href="${args.URL}">${args.label}</cta-link>`,
};

export const Filled = {
  args: {
    fill: 'filled',
  },
};

export const Outline = {
  args: {
    fill: 'outline',
  },
};

export const OutlinePill = {
  args: {
    fill: 'outline',
    radius: 'pill',
  },
};
