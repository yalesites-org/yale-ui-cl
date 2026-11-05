import "./LinkGrid";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/text-link/Link";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";
import { COLOR_OPTION_DESCRIPTION, colorOptionLabels } from "../../00-tokens/theme/color-options.js";
export default {
  title: 'Molecules/Link Grid',
  component: 'ycl-link-grid',
  argTypes: {
    theme: attributeArg(COLOR_OPTION_DESCRIPTION, {
      name: 'Color Option',
      options: ['primary', 'secondary', 'tertiary', 'accent-1', 'accent-2'],
      control: { type: 'select', labels: colorOptionLabels('ycl-link-grid') },
    }),
    lineTreatment: attributeArg('line-treatment: how the rules between links are drawn.', {
      name: 'Line Treatment',
      control: 'select',
      options: ['default', 'all-strong-lines', 'all-light-lines', 'no-lines'],
    }),
    heading: slotArg('Grid heading (slot="heading"). Omitted when empty.', { control: 'text' }),
    columnSlots: slotArg('Links go in slot="links-one" to "links-four", one list item each; optional column headings in slot="heading-one" to "heading-four". Only columns with links are drawn.', {
      name: 'Column slots',
      control: false,
    }),
  },
  args: {
    heading: 'This is a link grid',
    theme: 'primary',
    lineTreatment: 'default',
  },

  render: (args) => `
      <ycl-link-grid${attrs({ theme: args.theme, 'line-treatment': args.lineTreatment })}>
        ${args.heading ? `<ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : ''}

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
      </ycl-link-grid>`,
};

export const Default = {};
