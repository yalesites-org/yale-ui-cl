import "./Lists.js";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

const nestedList = (tag) => `
            <${tag}>
              <li>Nested Item 1
                <${tag}>
                  <li>Deeper Item 1</li>
                  <li>Deeper Item 2</li>
                </${tag}>
              </li>
              <li>Nested Item 2</li>
            </${tag}>`;

export default {
  title: 'Atoms/Lists',
  component: 'ycl-list',
  argTypes: {
    kind: slotArg('Slot a `<ul>` or an `<ol>`. Nested levels change bullet or numbering style.', {
      name: 'List Kind',
      control: 'select',
      options: ['unordered', 'ordered'],
    }),
    nested: slotArg('Nest lists inside the second item (ignored for taxonomy lists, which are flat).', { control: 'boolean' }),
    type: attributeArg('class="categories" or class="tags" renders the list inline as a taxonomy list with dividers.', {
      name: 'Taxonomy Type',
      control: 'select',
      options: ['none', 'categories', 'tags'],
      mapping: { none: undefined },
    }),
    items: slotArg('Top-level item text. The list itself goes in the default slot.', { control: 'object' }),
  },
  args: {
    kind: 'unordered',
    nested: false,
    type: 'none',
    items: ['List Item 1', 'List Item 2', 'List Item 3'],
  },
  render: (args) => {
    const tag = args.kind === 'ordered' ? 'ol' : 'ul';
    const items = (args.items ?? []).map((item, index) =>
      `<li>${item}${args.nested && !args.type && index === 1 ? nestedList(tag) : ''}</li>`,
    );
    return `<ycl-list${attrs({ class: args.type })}>
  <${tag}>
    ${items.join('\n    ')}
  </${tag}>
</ycl-list>`;
  },
};

export const Default = {};
