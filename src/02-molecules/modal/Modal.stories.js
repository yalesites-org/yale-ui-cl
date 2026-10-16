import "./Modal";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/button/Button";
import "../../01-atoms/cta/Cta";
import "../../01-atoms/text-link/Link";
export default {
  title: 'Molecules/Modal',
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
    `<ycl-button onclick="document.getElementById('demo-modal').show()">Demo Modal</ycl-button>
    <ycl-modal id="demo-modal">
      <ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>
      <p>${args.content}</p>
    </ycl-modal>`,
};

export const Default = {};

export const WithLinks = {
  args: {
    heading: 'Visiting Campus',
  },
  render: (args) =>
    `<ycl-button onclick="document.getElementById('links-modal').show()">Plan a visit</ycl-button>
    <ycl-modal id="links-modal">
      <ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>
      <p>Tours of Yale's campus leave from the Visitor Center at 149 Elm Street.</p>
      <p><ycl-text-link href="https://www.yale.edu">Yale University</ycl-text-link></p>
      <ycl-cta-link class="filled" href="https://www.yale.edu">Book a tour</ycl-cta-link>
    </ycl-modal>`,
};
