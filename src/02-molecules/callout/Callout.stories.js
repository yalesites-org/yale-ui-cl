import "./Callout";
import "../../01-atoms/cta/Cta";
import "../../01-atoms/text-link/Link";
import overlayImage from "../../assets/avif-test-image.avif";

const item = (args) => `
  <ycl-callout-item>
    <h2 slot="heading">${args.heading}</h2>
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
      name: 'Component Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
    alignment: {
      name: 'Callout Alignment',
      type: 'select',
      options: ['center', 'left'],
    },
    overlay: {name: 'Overlay Background Image', control: 'boolean'},
    globalTheme: {
      name: 'Site Global Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
  },
  args: {
    heading: 'Degree Programs',
    text: 'Designed for those who intend to pursue graduate and those who wish to immediately enter a career in which broad scientific training is beneficial.',
    linkText: 'Programs',
    linkType: 'cta',
    theme: 'one',
    alignment: 'center',
    overlay: false,
    globalTheme: 'one',
  },

  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-callout theme="${args.theme}" alignment="${args.alignment}"${args.overlay ? ` overlay-image="${overlayImage}"` : ''}>
        ${item(args)}
      </ycl-callout>
    </div>`,
};

export const Default = {};

export const Double = {
  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-callout theme="${args.theme}" alignment="${args.alignment}"${args.overlay ? ` overlay-image="${overlayImage}"` : ''}>
        ${item(args)}
        ${item({...args, heading: 'Research Opportunities', text: 'Work alongside faculty on projects spanning the sciences, humanities, and social sciences.', linkText: 'Find a lab'})}
      </ycl-callout>
    </div>`,
};

export const Themed = {
  args: {
    theme: 'four',
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
