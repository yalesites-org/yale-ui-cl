import "./Cta";

// Fade is the default animation and square corners the default radius, so those add no attribute;
// animate="none" opts out of animation entirely.
const optionAttributes = (args) => [
  `variant="${args.variant}"`,
  args.animate !== 'fade' && `animate="${args.animate}"`,
  args.radius !== 'none' && `radius="${args.radius}"`,
].filter(Boolean).join(' ');

export default {
  title: 'Atoms/CTA',
  component: 'ycl-cta-link',
  argTypes: {
    label: {control: 'text'},
    URL: {control: 'text'},
    variant: {
      name: 'Variant',
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
    variant: 'filled',
    animate: 'fade',
    radius: 'none',
  },

  render: (args) =>
    `<ycl-cta-link ${optionAttributes(args)} href="${args.URL}">${args.label}</ycl-cta-link>`,
};

export const Filled = {
  args: {
    variant: 'filled',
  },
};

export const Outline = {
  args: {
    variant: 'outline',
  },
};

export const OutlinePill = {
  args: {
    variant: 'outline',
    radius: 'pill',
  },
};
