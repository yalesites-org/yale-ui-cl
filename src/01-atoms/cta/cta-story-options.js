// CTA options shared by the stories of every element that takes them (ycl-cta-link, ycl-button).
import { attributeArg } from "../../../.storybook/story-helpers.js";

// Fade is the default animation, square corners the default radius and 2 the default outline
// weight, so their mappings drop the attribute; animate="none" opts out of animation entirely.
export const ctaArgTypes = {
  variant: attributeArg('variant: fill style. No variant renders filled.', {
    name: 'Variant',
    control: 'select',
    options: ['filled', 'outline'],
  }),
  outlineWeight: attributeArg('outline-weight: border thickness for the outline variant; 2 is the default and needs no attribute.', {
    name: 'Outline Weight',
    control: 'select',
    options: ['1', '2', '4'],
    mapping: { 2: undefined },
  }),
  animate: attributeArg('animate: hover animation. Fade is the default and needs no attribute; "none" turns it off.', {
    name: 'Animation Type',
    control: 'select',
    options: ['none', 'fade', 'rise', 'wipe'],
    mapping: { fade: undefined },
  }),
  radius: attributeArg('radius: corner radius; square corners need no attribute.', {
    name: 'Radius Type',
    control: 'select',
    options: ['none', 'soft', 'pill'],
    mapping: { none: undefined },
  }),
};

// The CTA option args as an attribute map for attrs().
export const ctaAttributes = (args) => ({
  variant: args.variant,
  'outline-weight': args.outlineWeight,
  animate: args.animate,
  radius: args.radius,
});
