import "./Accordion";
export default {
  title: 'Molecules/Accordion',
  component: 'ycl-accordion',
  argTypes: {
    heading: {control: 'text'},
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
},
  args: {
    heading: 'Frequently Asked Questions',
    theme: 'default',
    globalTheme: 'one',
},

  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-accordion theme="${args.theme}">
        <h2 slot="heading">${args.heading}</h2>
        <ycl-accordion-item>
          <h3 slot="heading">How do I apply?</h3>
          <p>Applications open in the fall. See the <a href="#">admissions page</a> for deadlines.</p>
        </ycl-accordion-item>
        <ycl-accordion-item>
          <h3 slot="heading">Is financial aid available?</h3>
          <p>Yes. Aid is awarded based on need.</p>
        </ycl-accordion-item>
        <ycl-accordion-item>
          <h3 slot="heading">Where can I find course listings?</h3>
          <p>Course listings are published each term.</p>
        </ycl-accordion-item>
      </ycl-accordion>
    </div>`,
};

export const Default = {};

export const Themed = {
  args: {
    theme: 'one',
  },
};
