import "./Lists.js";

export default {
  title: 'Atoms/Lists',
  component: 'ycl-list',
  argTypes: {
    type: {      
      name: "List Type",
      type: 'select',
      options: ['categories', 'tags'],},
    
},
  args: {
    type: '',
},

  render: () => 
    ``,
};

export const Default = {
  args: {
    type: '',
  },

  render: (args) =>
    `
      <ycl-list type="${args.type}">
        <ul>
          <li>List Item 1</li>
          <li>List Item 2</li>
          <li>List Item 3</li>
        </ul>
      </ycl-list>

        `
};