import "./RelatedContent";
import "../../01-atoms/headings/Heading";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

const sampleItems = [
  {type: 'Resource', category: 'Video', title: 'Voter ID Laws and the Erosion of Equal Access'},
  {type: 'Event', category: 'Paper Discussion', title: "Discuss George Heimel's Amazing Paper"},
  {type: 'Post', category: 'Announcement', title: "Good Things Come in Threes ... Citizens' Assemblies Too!"},
  {type: 'Resource', category: 'Student Paper', title: 'Swiss Voter Turnout Patterns and Public Attitudes Toward Digital Voting Infrastructure'},
  {type: 'Page', title: 'Center for Empirical Research in the Law'},
  {type: 'Profile', title: 'Dr. Jane Smith'},
];

export default {
  title: 'Molecules/Related Content',
  component: 'ycl-related-content',
  argTypes: {
    width: attributeArg('width="content" narrows the block to the content width; site is the default.', {
      name: 'Width',
      control: 'select',
      options: ['site', 'content'],
      mapping: { site: undefined },
    }),
    heading: slotArg('Section heading (slot="heading"); labels the region. Omitted when empty.', { control: 'text' }),
    itemCount: slotArg('ycl-related-content-item elements in the default slot. Each item takes href, type and category attributes and a heading slot.', {
      name: 'Number of Items',
      control: { type: 'number', min: 0, max: 6, step: 1 },
    }),
  },
  args: {
    heading: 'Related Content',
    itemCount: 6,
    width: 'site',
  },

  render: (args) =>
    `<ycl-related-content${attrs({ width: args.width })}>
      ${args.heading ? `<ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : ''}
      ${sampleItems.slice(0, Number(args.itemCount) || 0).map((item) => `<ycl-related-content-item${attrs({ href: '#', type: item.type, category: item.category })}>
        <ycl-heading level="3" slot="heading">${item.title}</ycl-heading>
      </ycl-related-content-item>`).join('')}
    </ycl-related-content>`,
};

export const Default = {};
