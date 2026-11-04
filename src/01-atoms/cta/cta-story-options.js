// CTA options shared by the stories of every element that takes them (ycl-cta-link, ycl-button).

// Fade is the default animation and square corners the default radius, so those add no attribute;
// animate="none" opts out of animation entirely.
export const optionAttributes = (args) => [
  `variant="${args.variant}"`,
  args.animate !== 'fade' && `animate="${args.animate}"`,
  args.radius !== 'none' && `radius="${args.radius}"`,
].filter(Boolean).join(' ');

export const optionArgTypes = {
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
};
