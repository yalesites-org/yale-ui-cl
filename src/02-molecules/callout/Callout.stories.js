import "./Callout";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/cta/Cta";
import "../../01-atoms/text-link/Link";
import overlayImage from "../../assets/avif-test-image.avif";

const item = (args) => `
  <ycl-callout-item>
    <ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>
    <p>${args.text}</p>
    ${args.linkType === 'link'
    ? `<text-link slot="link" href="https://www.yale.edu">${args.linkText}</text-link>`
    : `<cta-link slot="link" class="outline" href="https://www.yale.edu">${args.linkText}</cta-link>`}
  </ycl-callout-item>`;

export default {
  title: 'Molecules/Callout',
  component: 'ycl-callout',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    heading: {control: 'text'},
    text: {control: 'text'},
    linkText: {name: 'Link Text', control: 'text'},
    linkType: {
      name: 'Link Type',
      type: 'select',
      options: ['cta', 'link'],
    },
    theme: {
      name: 'Color Option',
      type: 'select',
      options: ['primary', 'accent-1', 'accent-2', 'tertiary', 'secondary'],
    },
    alignment: {
      name: 'Callout Alignment',
      type: 'select',
      options: ['center', 'left'],
    },
    overlay: {name: 'Overlay Background Image', control: 'boolean'},
  },
  args: {
    heading: 'Degree Programs',
    text: 'Designed for those who intend to pursue graduate and those who wish to immediately enter a career in which broad scientific training is beneficial.',
    linkText: 'Programs',
    linkType: 'cta',
    theme: 'primary',
    alignment: 'center',
    overlay: false,
  },

  render: (args) =>
    `<ycl-callout theme="${args.theme}" alignment="${args.alignment}"${args.overlay ? ` overlay-image="${overlayImage}"` : ''}>
      ${item(args)}
    </ycl-callout>`,
};

export const Default = {};

export const Double = {
  render: (args) =>
    `<ycl-callout theme="${args.theme}" alignment="${args.alignment}"${args.overlay ? ` overlay-image="${overlayImage}"` : ''}>
      ${item(args)}
      ${item({...args, heading: 'Research Opportunities', text: 'Work alongside faculty on projects spanning the sciences, humanities, and social sciences.', linkText: 'Find a lab'})}
    </ycl-callout>`,
};

export const Themed = {
  args: {
    theme: 'tertiary',
  },
};

export const WithOverlay = {
  args: {
    overlay: true,
  },
};

export const TextLink = {
  args: {
    linkType: 'link',
  },
};
