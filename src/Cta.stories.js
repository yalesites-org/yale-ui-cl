import { Cta } from "./Cta";
export default {
  title: 'CTA',
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
      options: ['fade', 'rise', 'wipe'],
  },
},
  args: {
    label: 'Yale HomePage',
    URL: 'https://www.yale.edu',
    fill: 'filled',
    animate: 'fade',
},

  render: (args) => 
    `<cta-link class="${args.fill} ${args.animate}"href="${args.URL}">${args.label}</cta-link>`,
};

export const Filled = {
  args: {
    fill: 'filled',
  },

  render: (args) =>
    `<cta-link class="${args.fill} animate-${args.animate}" href="${args.URL}">${args.label}</cta-link>`
};
