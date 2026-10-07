import "./RelatedContent";

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
    heading: {control: 'text'},
    itemCount: {name: 'Number of Items', control: {type: 'number', min: 0, max: 6, step: 1}},
    width: {
      name: 'Width',
      type: 'select',
      options: ['site', 'content'],
    },
},
  args: {
    heading: 'Related Content',
    itemCount: 6,
    width: 'site',
},

  render: (args) =>
    `<ycl-related-content width="${args.width}">
      ${args.heading ? `<h2 slot="heading">${args.heading}</h2>` : ''}
      ${sampleItems.slice(0, args.itemCount).map((item) => `<ycl-related-content-item href="#" type="${item.type}"${item.category ? ` category="${item.category}"` : ''}>
        <h3 slot="heading">${item.title}</h3>
      </ycl-related-content-item>`).join('')}
    </ycl-related-content>`,
};

export const Default = {};

export const ContentWidth = {
  args: {
    width: 'content',
    itemCount: 3,
  },
};
