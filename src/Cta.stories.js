import { Cta } from "./CTA";
export default {
  title: 'CTA',
  component: 'cta-link',
  argTypes: {
    label: {control: 'text'},
    URL: {control: 'text'},
  },
  args: {
    label: 'Yale HomePage',
    URL: 'https://www.yale.edu',

},

  render: (args) => 
    `<cta-link href="${args.URL}">${args.label}</cta-link>`,
  
};

export const Primary = {
  args: {
    label: 'Yale Homepage',
    URL: 'https://www.yale.edu',
  },
  render: (args) =>
    `<cta-link class="primary" href="${args.URL}">${args.label}</cta-link>`
};
