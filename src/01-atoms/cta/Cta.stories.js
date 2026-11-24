import "./Cta";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Atoms/CTA',
  component: 'ycl-cta-link',
  argTypes: {
    URL: attributeArg('href: link destination. External links get an external-link icon.', { control: 'text' }),
    variant: attributeArg('variant: fill style. "secondary" is a neutral grey outline.', {
      name: 'Variant',
      control: 'select',
      options: ['filled', 'outline', 'secondary'],
    }),
    size: attributeArg('size: padding and font size; leave unset for the default size.', {
      control: 'select',
      options: ['default', 'small', 'medium', 'large'],
      mapping: { default: undefined },
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
    label: slotArg('Link text (default slot).', { control: 'text' }),
  },
  args: {
    label: 'Yale HomePage',
    URL: 'https://www.yale.edu',
    variant: 'filled',
    size: 'default',
    animate: 'fade',
    radius: 'none',
  },

  render: (args) =>
    `<ycl-cta-link${attrs({
      href: args.URL,
      variant: args.variant,
      size: args.size,
      animate: args.animate,
      radius: args.radius,
    })}>${args.label ?? ''}</ycl-cta-link>`,
};

export const Default = {};
