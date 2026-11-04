// CTA options shared by the stories of every element that takes them (ycl-cta-link, ycl-button).

// Fade is the default animation, square corners the default radius and 2 the default outline
// weight, so those add no attribute; animate="none" opts out of animation entirely.
export const optionAttributes = (args) => [
  `variant="${args.variant}"`,
  args.outlineWeight && args.outlineWeight !== '2' && `outline-weight="${args.outlineWeight}"`,
  args.animate !== 'fade' && `animate="${args.animate}"`,
  args.radius !== 'none' && `radius="${args.radius}"`,
].filter(Boolean).join(' ');

export const optionArgTypes = {
  variant: {
    name: 'Variant',
    type: 'select',
    options: ['filled', 'outline'],
  },
  outlineWeight: {
    name: 'Outline Weight',
    type: 'select',
    options: ['1', '2', '4'],
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
