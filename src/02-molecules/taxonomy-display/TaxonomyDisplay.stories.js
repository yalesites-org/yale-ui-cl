import "./TaxonomyDisplay";
import "../../01-atoms/text-link/Link";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";
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
    theme: attributeArg(COLOR_OPTION_DESCRIPTION, {
      name: 'Color Option',
      options: ['default', 'primary', 'secondary', 'tertiary', 'accent-1', 'accent-2'],
      control: { type: 'select', labels: colorOptionLabels('ycl-taxonomy-display') },
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
  },
  args: {
    theme: 'default',
    width: 'site',
    showTaxonomy: true,
  },

  render: (args) => `
      <ycl-taxonomy-display${attrs({ theme: args.theme, width: args.width })}>
        ${items.map((item) => `<ycl-taxonomy-display-item label="${item.label}">
          ${args.showTaxonomy ? item.terms.map((term) => `<ycl-text-link href="#">${term}</ycl-text-link>`).join('') : ''}
        </ycl-taxonomy-display-item>`).join('')}
      </ycl-taxonomy-display>`,
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
