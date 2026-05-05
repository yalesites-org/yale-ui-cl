export default {
  title: 'Lists',
  component: 'yc-list',
  argTypes: {
    label: {control: 'text'},
    
},
  args: {
    label: 'Example List',
},

  render: (args) => 
    ``,
};

export const Default = {

  render: (args) =>
    `<ul>
        <li>List Item 1</li>
        <li>List Item 2</li>
        <li>List Item 3</li>
      </ul>

        `
};