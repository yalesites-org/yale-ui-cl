import "./Cta";

// cta.css variants are prefixed (cta--animate-rise, cta--radius-pill), so the class names are
// built from the arg values. Fade is the default animation, so it adds no class; "none" opts out
// with animate-none.
const variantClasses = (args) => [
  args.fill,
  args.animate !== 'fade' && `animate-${args.animate}`,
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
