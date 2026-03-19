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
	 radius: {
	  name: 'Radius Type',
	  type: 'select',
	  options: ['soft', 'pill'],
	 },
},
  args: {
    label: 'Yale HomePage',
    URL: 'https://www.yale.edu',
    fill: 'filled',
    animate: 'fade',
	radius: '',
},

  render: (args) => 
    `<cta-link class="${args.fill} ${args.animate} ${args.radius}" href="${args.URL}">${args.label}</cta-link>`,
};

export const Filled = {
  args: {
    fill: 'filled',
	 radius: '',
  },

  render: (args) =>
    `<cta-link class="${args.fill} animate-${args.animate} radius-${args.radius}" href="${args.URL}">${args.label}</cta-link>`
};
