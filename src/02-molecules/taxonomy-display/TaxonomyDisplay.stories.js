import "./TaxonomyDisplay";
import "../../01-atoms/text-link/Link";
import { COLOR_OPTION_DESCRIPTION, colorOptionLabels } from "../../00-tokens/theme/color-options.js";

const items = [
  {label: 'Audience', terms: ['Undergraduates', 'Graduates']},
  {label: 'Type', terms: ['How To']},
  {label: 'Category', terms: ['Learning']},
];

export default {
  title: 'Molecules/Taxonomy Display',
  component: 'ycl-taxonomy-display',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: {
      name: 'Color Option',
      description: COLOR_OPTION_DESCRIPTION,
      options: ['default', 'primary', 'secondary', 'tertiary', 'accent-1', 'accent-2'],
      control: { type: 'select', labels: colorOptionLabels('ycl-taxonomy-display') },
    },
    showTaxonomy: {name: 'Show Taxonomy', control: 'boolean'},
},
  args: {
    theme: 'default',
    showTaxonomy: true,
},

  render: (args) =>
    `<ycl-taxonomy-display theme="${args.theme}">
      ${items.map((item) => `<ycl-taxonomy-display-item label="${item.label}">
        ${args.showTaxonomy ? item.terms.map((term) => `<ycl-text-link href="#">${term}</ycl-text-link>`).join('') : ''}
      </ycl-taxonomy-display-item>`).join('')}
    </ycl-taxonomy-display>`,
};

export const Default = {};

export const Themed = {
  args: {
    theme: 'primary',
  },
};

export const Empty = {
  args: {
    showTaxonomy: false,
  },
};

export const PlainLinks = {
  render: () =>
    `<ycl-taxonomy-display>
      <ycl-taxonomy-display-item label="Audience"><a href="#">Undergraduates</a><a href="#">Graduates</a></ycl-taxonomy-display-item>
      <ycl-taxonomy-display-item label="Type"><a href="#">How To</a></ycl-taxonomy-display-item>
    </ycl-taxonomy-display>`,
};
