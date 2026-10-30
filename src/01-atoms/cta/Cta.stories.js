import "./Cta";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

// cta.css variants are prefixed (cta--animate-rise, cta--radius-pill), so the class names are
// built from the arg values. Fade is the default animation, so it adds no class; "none" opts out
// with animate-none.
const variantClasses = (args) => [
  args.fill,
  args.secondary && 'secondary',
  args.size,
  args.animate && `animate-${args.animate}`,
  args.radius && `radius-${args.radius}`,
].filter(Boolean).join(' ');

export default {
  title: 'Atoms/CTA',
  component: 'cta-link',
  argTypes: {
    URL: attributeArg('href: link destination. External links get an external-link icon.', { control: 'text' }),
    fill: attributeArg('Fill, set as a class.', { name: 'Fill Type', control: 'select', options: ['filled', 'outline'] }),
    secondary: attributeArg('Secondary color scheme (class "secondary").', { control: 'boolean' }),
    size: attributeArg('Size, set as a class.', {
      control: 'select',
      options: ['default', 'small', 'medium', 'large'],
      mapping: { default: undefined },
    }),
    animate: attributeArg('Hover animation, set as a class (fade is the default).', {
      name: 'Animation Type',
      control: 'select',
      options: ['none', 'fade', 'rise', 'wipe'],
      mapping: { fade: undefined },
    }),
    radius: attributeArg('Corner radius, set as a class.', {
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
    fill: 'filled',
    secondary: false,
    size: 'default',
    animate: 'fade',
    radius: 'none',
  },

  render: (args) =>
    `<cta-link${attrs({ class: variantClasses(args), href: args.URL })}>${args.label ?? ''}</cta-link>`,
};

export const Default = {};
