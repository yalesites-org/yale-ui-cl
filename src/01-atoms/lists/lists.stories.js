import { List } from "./Lists.js";

export default {
  title: 'Lists',
  component: 'yc-list',
  argTypes: {
    type: {      
      name: "List Type",
      type: 'select',
      options: ['categories', 'tags'],},
    
},
  args: {
    type: '',
},

  render: (args) => 
    ``,
};

export const Default = {
  args: {
    type: '',
  },

  render: (args) =>
    `
      <ycl-list class="${args.type}">
        <ul>
          <li>List Item 1</li>
          <li>List Item 2</li>
          <li>List Item 3</li>
        </ul>
      </ycl-list>

        `
};