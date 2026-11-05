import "./Accordion";
import "../../01-atoms/headings/Heading";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";
import { COLOR_OPTION_DESCRIPTION, colorOptionLabels } from "../../00-tokens/theme/color-options.js";

export default {
  title: 'Molecules/Accordion',
  component: 'ycl-accordion',
  argTypes: {
    theme: attributeArg(COLOR_OPTION_DESCRIPTION, {
      name: 'Color Option',
      options: ['default', 'primary', 'secondary', 'tertiary', 'accent-1', 'accent-2'],
      control: { type: 'select', labels: colorOptionLabels('ycl-accordion') },
    }),
    width: attributeArg('Width of the accordion; "content" is the default.', {
      name: 'Width',
      control: 'select',
      options: ['content', 'highlight', 'site', 'max'],
    }),
    alignment: attributeArg('Alignment of the accordion within its width; "center" is the default.', {
      name: 'Alignment',
      control: 'select',
      options: ['center', 'left'],
    }),
    expanded: attributeArg('expanded on a ycl-accordion-item opens it. Shown here on the first item.', {
      name: 'First Item Expanded',
      control: 'boolean',
    }),
    heading: slotArg('Accordion heading (slot="heading" on ycl-accordion). Omitted when empty.', { control: 'text' }),
    items: slotArg('ycl-accordion-item elements (default slot). Each item takes its toggle text in slot="heading" and its content in the default slot.', {
      control: false,
    }),
  },
  args: {
    heading: 'Frequently Asked Questions',
    theme: 'default',
    width: 'content',
    alignment: 'center',
    expanded: false,
  },

  render: (args) => `
      <ycl-accordion${attrs({ theme: args.theme, width: args.width, alignment: args.alignment })}>${args.heading ? `
        <ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : ''}
        <ycl-accordion-item${attrs({ expanded: args.expanded })}>
          <ycl-heading level="3" slot="heading">How do I apply?</ycl-heading>
          <p>Applications open in the fall. See the <a href="#">admissions page</a> for deadlines.</p>
        </ycl-accordion-item>
        <ycl-accordion-item>
          <ycl-heading level="3" slot="heading">Is financial aid available?</ycl-heading>
          <p>Yes. Aid is awarded based on need.</p>
        </ycl-accordion-item>
        <ycl-accordion-item>
          <ycl-heading level="3" slot="heading">Where can I find course listings?</ycl-heading>
          <p>Course listings are published each term.</p>
        </ycl-accordion-item>
      </ycl-accordion>`,
};

export const Default = {};
