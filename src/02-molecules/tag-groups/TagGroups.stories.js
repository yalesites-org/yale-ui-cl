import "./TagGroups";
import "../../01-atoms/text-link/Link";

const items = [
  {label: 'Audience', terms: ['Undergraduates', 'Graduates']},
  {label: 'Type', terms: ['How To']},
  {label: 'Category', terms: ['Learning']},
];

export default {
  title: 'Molecules/Tag Groups',
  component: 'ycl-tag-groups',
  parameters: {
    yalesites: { name: 'Taxonomy Display', story: 'molecules-taxonomy-display--taxonomy-display' },
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
    showTags: {name: 'Show Tags', control: 'boolean'},
},
  args: {
    theme: 'default',
    globalTheme: 'one',
    showTags: true,
},

  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-tag-groups theme="${args.theme}">
        ${items.map((item) => `<ycl-tag-group label="${item.label}">
          ${args.showTags ? item.terms.map((term) => `<text-link href="#">${term}</text-link>`).join('') : ''}
        </ycl-tag-group>`).join('')}
      </ycl-tag-groups>
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
    showTags: false,
  },
};

export const PlainLinks = {
  render: () =>
    `<ycl-tag-groups>
      <ycl-tag-group label="Audience"><a href="#">Undergraduates</a><a href="#">Graduates</a></ycl-tag-group>
      <ycl-tag-group label="Type"><a href="#">How To</a></ycl-tag-group>
    </ycl-tag-groups>`,
};
