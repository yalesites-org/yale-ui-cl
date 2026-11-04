import "./LinkGrid";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/text-link/Link";
export default {
  title: 'Molecules/Link Grid',
  component: 'ycl-link-grid',
  argTypes: {
    heading: {control: 'text'},
    theme: {
      name: 'Component Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
    lineTreatment: {
      name: 'Line Treatment',
      type: 'select',
      options: ['default', 'all-strong-lines', 'all-light-lines', 'no-lines'],
    },
    globalTheme: {
      name: 'Site Global Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
},
  args: {
    heading: 'This is a link grid',
    theme: 'one',
    lineTreatment: 'default',
    globalTheme: 'one',
},

  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-link-grid theme="${args.theme}" line-treatment="${args.lineTreatment}">
        <ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>

        <ycl-heading level="3" slot="heading-one">Heading for link group one</ycl-heading>
        <ycl-text-link slot="links-one" href="#">This is a link</ycl-text-link>
        <ycl-text-link slot="links-one" href="#">This is another link</ycl-text-link>
        <ycl-text-link slot="links-one" href="https://google.com">This is a very long link that will wrap lines</ycl-text-link>
        <ycl-text-link slot="links-one" href="https://google.com/download.pdf">Link #4</ycl-text-link>

        <ycl-heading level="3" slot="heading-two">Heading for link group two</ycl-heading>
        <ycl-text-link slot="links-two" href="#">This is a link in the second column</ycl-text-link>
        <ycl-text-link slot="links-two" href="#">This is another link, column two</ycl-text-link>
        <ycl-text-link slot="links-two" href="#">This is a very long link that will wrap lines</ycl-text-link>
        <ycl-text-link slot="links-two" href="#">Link #4 column 2</ycl-text-link>
        <ycl-text-link slot="links-two" href="#">Link #5 column 2</ycl-text-link>
        <ycl-text-link slot="links-two" href="#">Link #6 column 2</ycl-text-link>

        <ycl-text-link slot="links-three" href="#">This is a link in the third column</ycl-text-link>
        <ycl-text-link slot="links-three" href="#">This is another link</ycl-text-link>
        <ycl-text-link slot="links-three" href="#">This is a very long link that will wrap lines</ycl-text-link>
        <ycl-text-link slot="links-three" href="#">Link #4 column #3</ycl-text-link>

        <ycl-text-link slot="links-four" href="#">This is a link in the fourth column</ycl-text-link>
        <ycl-text-link slot="links-four" href="#">This is another link in column 4</ycl-text-link>
        <ycl-text-link slot="links-four" href="#">This is a very long link that will wrap lines</ycl-text-link>
        <ycl-text-link slot="links-four" href="#">Link #4 column #4</ycl-text-link>
      </ycl-link-grid>
    </div>`,
};

export const Default = {};

export const ThemeTwo = {
  args: {
    theme: 'two',
  },
};

export const AllStrongLines = {
  args: {
    lineTreatment: 'all-strong-lines',
  },
};

export const NoLines = {
  args: {
    lineTreatment: 'no-lines',
  },
};
