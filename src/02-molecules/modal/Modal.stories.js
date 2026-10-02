import "./Modal";
import "../../01-atoms/cta/Cta";
import "../../01-atoms/text-link/Link";
export default {
  title: 'Modal',
  component: 'ycl-modal',
  argTypes: {
    heading: {control: 'text'},
    content: {control: 'text'},
  },
  args: {
    heading: 'Modal title',
    content: 'Modal content',
  },

  render: (args) =>
    `<button type="button" onclick="document.getElementById('demo-modal').show()">Demo Modal</button>
    <ycl-modal id="demo-modal">
      <h2 slot="heading">${args.heading}</h2>
      <p>${args.content}</p>
    </ycl-modal>`,
};

export const Default = {};

export const WithLinks = {
  args: {
    heading: 'Visiting Campus',
  },
  render: (args) =>
    `<button type="button" onclick="document.getElementById('links-modal').show()">Plan a visit</button>
    <ycl-modal id="links-modal">
      <h2 slot="heading">${args.heading}</h2>
      <p>Tours of Yale's campus leave from the Visitor Center at 149 Elm Street.</p>
      <p><text-link href="https://www.yale.edu">Yale University</text-link></p>
      <cta-link class="filled" href="https://www.yale.edu">Book a tour</cta-link>
    </ycl-modal>`,
};
