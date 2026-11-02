import "./Cta";
import { optionAttributes, optionArgTypes } from "./cta-story-options.js";

export default {
  title: 'Atoms/CTA',
  component: 'ycl-cta-link',
  argTypes: {
    label: {control: 'text'},
    URL: {control: 'text'},
    ...optionArgTypes,
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
