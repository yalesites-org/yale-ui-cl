import "./LinkGroup";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/text-link/Link";
import { slotArg } from "../../../.storybook/story-helpers.js";
export default {
  title: 'Molecules/Link Group',
  component: 'ycl-link-group',
  argTypes: {
    headingOne: slotArg('Heading over the first column (slot="heading-one"). Omitted when empty.', { control: 'text' }),
    headingTwo: slotArg('Heading over the second column (slot="heading-two"). Omitted when empty.', { control: 'text' }),
    linkSlots: slotArg('Links go in slot="links-one" and slot="links-two"; each becomes its own list item.', {
      name: 'Link slots',
      control: false,
    }),
  },
  args: {
    headingOne: 'Heading for Link Group One',
    headingTwo: 'Heading for Link Group Two',
  },

  render: (args) =>
    `<ycl-link-group>
      ${args.headingOne ? `<ycl-heading level="2" slot="heading-one">${args.headingOne}</ycl-heading>` : ''}
      ${args.headingTwo ? `<ycl-heading level="2" slot="heading-two">${args.headingTwo}</ycl-heading>` : ''}
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
