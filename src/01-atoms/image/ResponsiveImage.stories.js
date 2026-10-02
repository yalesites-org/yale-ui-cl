import "./ResponsiveImage";

// Inline SVG placeholders so the stories don't depend on image files being served.
const placeholder = (width, height, label) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#dddddd"/><text x="50%" y="50%" fill="#4a4a4a" font-family="sans-serif" font-size="${height / 8}" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`)}`;

const ratios = {
  '16x9': [1600, 900],
  '3x2': [1500, 1000],
  '4x3': [1600, 1200],
  '1x1': [1000, 1000],
  '2x3': [1000, 1500],
  '1x1.6': [1000, 1600],
};

export default {
  title: 'Image',
  component: 'ycl-image',
  argTypes: {
    aspectRatio: {
      name: 'Aspect Ratio',
      type: 'select',
      options: Object.keys(ratios),
    },
    caption: { control: 'text' },
  },
  args: {
    aspectRatio: '16x9',
    caption: '',
  },
  render: (args) => {
    const [width, height] = ratios[args.aspectRatio];
    return `<ycl-image ratio="${args.aspectRatio}" style="max-width: 40rem;">
      <img src="${placeholder(width, height, args.aspectRatio)}" alt="A ${args.aspectRatio.replace('x', ' by ')} image">
      ${args.caption ? `<p slot="caption">${args.caption}</p>` : ''}
    </ycl-image>`;
  },
};

export const Default = {};

export const Figure = {
  args: {
    aspectRatio: '3x2',
    caption: 'Sterling Memorial Library at dusk. Photo by <a href="#">Yale Office of Public Affairs</a>.',
  },
};

export const ResponsivePicture = {
  render: () =>
    `<ycl-image style="max-width: 40rem;">
      <picture>
        <source media="(min-width: 992px)" srcset="${placeholder(1600, 900, 'Wide (16x9)')}">
        <img src="${placeholder(1000, 1000, 'Narrow (1x1)')}" alt="Old Campus in the fall">
      </picture>
      <span slot="caption">Resize the window past 992px to swap sources.</span>
    </ycl-image>`,
};

export const Ratios = {
  render: () =>
    `<div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
      ${Object.entries(ratios).map(([ratio, [width, height]]) =>
        `<ycl-image ratio="${ratio}" style="flex: 1 0 clamp(10rem, 40%, 20rem);">
          <img src="${placeholder(width, height, ratio)}" alt="A ${ratio.replace('x', ' by ')} image">
        </ycl-image>`).join('')}
    </div>`,
};
