import "./LinkGroup";
import "../../01-atoms/text-link/Link";
export default {
  title: 'Molecules/Link Group',
  component: 'ycl-link-group',
  argTypes: {
    headingOne: {control: 'text'},
    headingTwo: {control: 'text'},
},
  args: {
    headingOne: 'Heading for Link Group One',
    headingTwo: 'Heading for Link Group Two',
},

  render: (args) =>
    `<ycl-link-group>
      ${args.headingOne ? `<h2 slot="heading-one">${args.headingOne}</h2>` : ''}
      ${args.headingTwo ? `<h2 slot="heading-two">${args.headingTwo}</h2>` : ''}
      <text-link slot="links-one" href="#">This is a link</text-link>
      <text-link slot="links-one" href="#">This is another link</text-link>
      <text-link slot="links-one" href="#">This is a very long link that will wrap lines</text-link>
      <text-link slot="links-one" href="https://google.com">Link #4</text-link>
      <text-link slot="links-two" href="#">This is a link</text-link>
      <text-link slot="links-two" href="#">This is another link</text-link>
      <text-link slot="links-two" href="#">This is a very long link that will wrap lines</text-link>
      <text-link slot="links-two" href="https://google.com/download.pdf">Link #4</text-link>
    </ycl-link-group>`,
};

export const Default = {};

export const SingleHeading = {
  args: {
    headingTwo: '',
  },
};

export const NoHeadings = {
  args: {
    headingOne: '',
    headingTwo: '',
  },
};
