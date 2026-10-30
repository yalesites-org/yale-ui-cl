import "./Breadcrumbs";
import "../../01-atoms/text-link/Link";

// The trail from the YaleSites breadcrumbs story; the last item is the current page.
const trail = [
  'Home',
  'Academic Programs',
  'Undergraduate Chemistry',
  'Another Level',
  'Still more levels',
  'This is a really long breadcrumb',
  'This one is six levels deep',
  'Davis Team Project Wins Award for Research',
];

const links = (titles) => titles.map((title) => `<text-link href="#">${title}</text-link>`).join('\n      ');

export default {
  title: 'Molecules/Breadcrumbs',
  component: 'ycl-breadcrumbs',
  argTypes: {
    label: {control: 'text'},
    wrap: {control: 'boolean'},
    noCurrent: {name: 'No current page', control: 'boolean'},
},
  args: {
    label: 'Breadcrumb',
    wrap: false,
    noCurrent: false,
    items: trail,
},

  render: (args) =>
    `<ycl-breadcrumbs label="${args.label}"${args.wrap ? ' wrap' : ''}${args.noCurrent ? ' no-current' : ''}>
      ${links(args.items)}
    </ycl-breadcrumbs>`,
};

export const Default = {};

export const Short = {
  args: {
    items: ['Home', 'Academic Programs'],
  },
};

export const Wrapped = {
  args: {
    wrap: true,
  },
};
