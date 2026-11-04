import "./Link";

const link = (args) =>
  `<ycl-text-link href="${args.URL}" link-style="${args.linkStyle}"${args.chevron ? ' chevron' : ''}>${args.label}</ycl-text-link>`;

export default {
  title: 'Atoms/Text Link',
  component: 'ycl-text-link',
  argTypes: {
    label: {control: 'text'},
    URL: {control: 'text'},
    linkStyle: {
      name: 'Link Style',
      type: 'select',
      options: ['underline', 'no-underline', 'no-animation'],
    },
    chevron: {name: 'With Chevron', control: 'boolean'},
},
  args: {
    label: 'Yale HomePage',
    URL: 'https://www.yale.edu',
    linkStyle: 'underline',
    chevron: false,
},

  render: link,
};

export const InternalLink = {
  args: {
    URL: "/index.html",
    label: "Home"
  },
};

export const ExternalLink = {
  args: {
    label: "Yale Homepage",
    URL: "https://www.yale.edu"
  },
};

export const DownloadLink = {
  args: {
    label: "Yale Homepage",
    URL: "https://www.yale.edu/download.pdf"
  },
};

export const NoUnderline = {
  args: {
    URL: "/index.html",
    label: "This is a no-underline link",
    linkStyle: "no-underline",
  },
};

export const NoAnimation = {
  args: {
    URL: "/index.html",
    label: "This is a long link without animated underlines",
    linkStyle: "no-animation",
  },
};

export const WithChevron = {
  args: {
    URL: "/index.html",
    label: "This is a link with chevron",
    chevron: true,
  },
};
