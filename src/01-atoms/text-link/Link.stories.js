import "./Link";
export default {
  title: 'Atoms/Text Link',
  component: 'ycl-text-link',
  argTypes: {
    label: {control: 'text'},
    URL: {control: 'text'},
},
  args: {
    label: 'Yale HomePage',
    URL: 'https://www.yale.edu',
},

  render: (args) => 
    `<ycl-text-link class="" href="${args.URL}">${args.label}</ycl-text-link>`,
};

export const InternalLink = {
  args: {
    URL: "/index.html",
    label: "Home"
  },
  render:(args) =>
    `<ycl-text-link class="" href="${args.URL}">${args.label}</ycl-text-link>`
};

export const ExternalLink = {
  args: {
    label: "Yale Homepage",
    URL: "https://www.yale.edu"
  },
  render:args => `<ycl-text-link class="" href="${args.URL}">${args.label}</ycl-text-link>`
};

export const DownloadLink = {
  args: {
    label: "Yale Homepage",
    URL: "https://www.yale.edu/download.pdf"
  },
  render:args => `<ycl-text-link class="" href="${args.URL}">${args.label}</ycl-text-link>`
};
