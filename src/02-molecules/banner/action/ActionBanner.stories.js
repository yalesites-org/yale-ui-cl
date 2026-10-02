import "./ActionBanner";
import "../../../01-atoms/cta/Cta";
import "../../../01-atoms/text-link/Link";

// Inline placeholders so the story doesn't depend on hosted images.
const placeholderImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#978d85"/><text x="800" y="450" font-family="sans-serif" font-size="96" fill="#fff" text-anchor="middle" dominant-baseline="middle">16 x 9</text></svg>')}`;
const patternImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="20"><path d="M0 10 Q10 0 20 10 T40 10" fill="none" stroke="#000" stroke-width="3"/></svg>')}`;

const links = (args) => {
  if (args.linkStyle === 'none') return '';
  if (args.linkStyle === 'text-link') {
    return `<text-link slot="actions" href="https://google.com">${args.linkContent}</text-link>
      <text-link slot="actions" href="https://yale.edu">${args.linkContentTwo}</text-link>`;
  }
  return `<cta-link slot="actions" class="filled" href="https://google.com">${args.linkContent}</cta-link>
    <cta-link slot="actions" class="outline" href="https://yale.edu">${args.linkContentTwo}</cta-link>`;
};

export default {
  title: 'Action Banner',
  component: 'ycl-action-banner',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    heading: {control: 'text'},
    snippet: {control: 'text'},
    linkContent: {control: 'text'},
    linkContentTwo: {control: 'text'},
    theme: {
      name: 'Component Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
    globalTheme: {
      name: 'Site Global Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
    linkStyle: {
      name: 'Link Style',
      type: 'select',
      options: ['cta', 'text-link', 'none'],
    },
    layout: {
      name: 'Content Layout',
      type: 'select',
      options: ['bottom', 'left', 'right'],
    },
    buttonAlignment: {
      name: 'Button Alignment',
      type: 'select',
      options: ['left', 'center', 'right'],
    },
    overlay: {
      name: 'Overlay Background Image',
      control: 'boolean',
    },
    width: {
      name: 'Banner Width',
      type: 'select',
      options: ['site', 'full'],
    },
  },
  args: {
    heading: 'Heading for the Banner',
    snippet: 'Text option, in case there is more that needs to be said.',
    linkContent: 'This is a link',
    linkContentTwo: 'This is another link',
    theme: 'one',
    globalTheme: 'one',
    linkStyle: 'cta',
    layout: 'bottom',
    buttonAlignment: 'right',
    overlay: false,
    width: 'site',
  },

  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-action-banner theme="${args.theme}" layout="${args.layout}" button-alignment="${args.buttonAlignment}" width="${args.width}"${args.overlay ? ` overlay-image="${patternImage}"` : ''}>
        <img slot="image" src="${placeholderImage}" alt="A 16 by 9 image">
        <h2 slot="heading">${args.heading}</h2>
        <p>${args.snippet}</p>
        ${links(args)}
      </ycl-action-banner>
    </div>`,
};

export const Default = {};

export const LeftLayout = {
  args: {
    layout: 'left',
    buttonAlignment: 'left',
  },
};

export const RightLayout = {
  args: {
    layout: 'right',
    buttonAlignment: 'left',
  },
};

export const FullWidth = {
  args: {
    width: 'full',
  },
};

export const WithOverlay = {
  args: {
    overlay: true,
  },
};

export const Themed = {
  args: {
    theme: 'two',
    linkStyle: 'text-link',
  },
};
