import "./TaxonomyDisplay";
import "../../01-atoms/text-link/Link";

const items = [
  {label: 'Audience', terms: ['Undergraduates', 'Graduates']},
  {label: 'Type', terms: ['How To']},
  {label: 'Category', terms: ['Learning']},
];

export default {
  title: 'Taxonomy Display',
  component: 'ycl-taxonomy-display',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    theme: {
      name: 'Component Theme',
      type: 'select',
      options: ['default', 'one', 'two', 'three', 'four', 'five', 'six'],
    },
    globalTheme: {
      name: 'Site Global Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
    showTaxonomy: {name: 'Show Taxonomy', control: 'boolean'},
},
  args: {
    theme: 'default',
    globalTheme: 'one',
    showTaxonomy: true,
},

  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-taxonomy-display theme="${args.theme}">
        ${items.map((item) => `<ycl-taxonomy-display-item label="${item.label}">
          ${args.showTaxonomy ? item.terms.map((term) => `<text-link href="#">${term}</text-link>`).join('') : ''}
        </ycl-taxonomy-display-item>`).join('')}
      </ycl-taxonomy-display>
    </div>`,
};

export const Default = {};

export const Themed = {
  args: {
    theme: 'one',
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
