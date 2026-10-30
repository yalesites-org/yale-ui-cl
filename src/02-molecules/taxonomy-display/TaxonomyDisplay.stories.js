import "./TaxonomyDisplay";
import "../../01-atoms/text-link/Link";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme } from "../../../.storybook/story-helpers.js";

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
    theme: attributeArg('Background theme.', {
      name: 'Component Theme',
      control: 'select',
      options: ['default', 'one', 'two', 'three', 'four', 'five', 'six'],
      mapping: { default: undefined },
    }),
    width: attributeArg('Maximum width of the block; site is the default.', {
      control: 'select',
      options: ['site', 'content', 'highlight'],
      mapping: { site: undefined },
    }),
    showTaxonomy: slotArg('ycl-taxonomy-display-item elements (each with a label attribute) go in the default slot, with their term links in the item\'s own default slot. Untick to leave the items empty, which shows "None".', {
      name: 'Show Taxonomy',
      control: 'boolean',
    }),
    globalTheme: globalThemeArgType,
  },
  args: {
    theme: 'default',
    width: 'site',
    globalTheme: 'one',
    showTaxonomy: true,
  },

  render: (args) => withGlobalTheme(args.globalTheme, `
      <ycl-taxonomy-display${attrs({ theme: args.theme, width: args.width })}>
        ${items.map((item) => `<ycl-taxonomy-display-item label="${item.label}">
          ${args.showTaxonomy ? item.terms.map((term) => `<text-link href="#">${term}</text-link>`).join('') : ''}
        </ycl-taxonomy-display-item>`).join('')}
      </ycl-taxonomy-display>`),
};

export const Default = {};

export const PlainLinks = {
  parameters: {
    docs: {
      description: {
        story: 'Terms slotted as plain `<a>` elements rather than text-link. The kind of slotted element is markup, which controls cannot swap.',
      },
    },
  },
  render: () =>
    `<ycl-taxonomy-display>
      <ycl-taxonomy-display-item label="Audience"><a href="#">Undergraduates</a><a href="#">Graduates</a></ycl-taxonomy-display-item>
      <ycl-taxonomy-display-item label="Type"><a href="#">How To</a></ycl-taxonomy-display-item>
    </ycl-taxonomy-display>`,
};
