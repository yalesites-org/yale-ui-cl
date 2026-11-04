import "./Accordion";
import "../../01-atoms/headings/Heading";
import { COLOR_OPTION_DESCRIPTION, colorOptionLabels } from "../../00-tokens/theme/color-options.js";
export default {
  title: 'Molecules/Accordion',
  component: 'ycl-accordion',
  argTypes: {
    heading: {control: 'text'},
    theme: {
      name: 'Color Option',
      description: COLOR_OPTION_DESCRIPTION,
      options: ['default', 'primary', 'secondary', 'tertiary', 'accent-1', 'accent-2'],
      control: { type: 'select', labels: colorOptionLabels('ycl-accordion') },
    },
    width: {
      name: 'Width',
      type: 'select',
      options: ['content', 'highlight', 'site', 'max'],
    },
    alignment: {
      name: 'Alignment',
      type: 'select',
      options: ['center', 'left'],
    },
},
  args: {
    heading: 'Frequently Asked Questions',
    theme: 'default',
    width: 'content',
    alignment: 'center',
},

  render: (args) =>
    `<ycl-accordion theme="${args.theme}" width="${args.width}" alignment="${args.alignment}">
      <ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>
      <ycl-accordion-item>
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

export const Themed = {
  args: {
    theme: 'primary',
  },
};

export const SiteWidthLeftAligned = {
  args: {
    width: 'site',
    alignment: 'left',
  },
};
