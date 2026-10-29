import "./Accordion";
import "../../01-atoms/headings/Heading";
export default {
  title: 'Molecules/Accordion',
  component: 'ycl-accordion',
  argTypes: {
    heading: {control: 'text'},
    theme: {
      name: 'Color Option',
      type: 'select',
      options: ['default', 'primary', 'secondary', 'tertiary', 'accent-1', 'accent-2'],
    },
},
  args: {
    heading: 'Frequently Asked Questions',
    theme: 'default',
},

  render: (args) =>
    `<ycl-accordion theme="${args.theme}">
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
