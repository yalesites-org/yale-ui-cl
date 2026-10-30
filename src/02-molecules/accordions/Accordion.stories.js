import "./Accordion";
import "../../01-atoms/headings/Heading";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Molecules/Accordion',
  component: 'ycl-accordion',
  argTypes: {
    theme: attributeArg('Component theme; "default" (or no attribute) is unthemed.', {
      name: 'Component Theme',
      control: 'select',
      options: ['default', 'one', 'two', 'three', 'four', 'five', 'six'],
      mapping: { default: undefined },
    }),
    expanded: attributeArg('expanded on a ycl-accordion-item opens it. Shown here on the first item.', {
      name: 'First Item Expanded',
      control: 'boolean',
    }),
    heading: slotArg('Accordion heading (slot="heading" on ycl-accordion). Omitted when empty.', { control: 'text' }),
    items: slotArg('ycl-accordion-item elements (default slot). Each item takes its toggle text in slot="heading" and its content in the default slot.', {
      control: false,
    }),
    globalTheme: globalThemeArgType,
  },
  args: {
    heading: 'Frequently Asked Questions',
    theme: 'default',
    expanded: false,
    globalTheme: 'one',
  },

  render: (args) => withGlobalTheme(args.globalTheme, `
      <ycl-accordion${attrs({ theme: args.theme })}>${args.heading ? `
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
      </ycl-accordion>`),
};

export const Default = {};
