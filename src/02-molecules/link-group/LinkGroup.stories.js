import "./LinkGroup";
export default {
  title: 'Link Group',
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
      <a slot="links-one" href="#">This is a link</a>
      <a slot="links-one" href="#">This is another link</a>
      <a slot="links-one" href="#">This is a very long link that will wrap lines</a>
      <a slot="links-one" href="https://google.com">Link #4</a>
      <a slot="links-two" href="#">This is a link</a>
      <a slot="links-two" href="#">This is another link</a>
      <a slot="links-two" href="#">This is a very long link that will wrap lines</a>
      <a slot="links-two" href="https://google.com/download.pdf">Link #4</a>
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
