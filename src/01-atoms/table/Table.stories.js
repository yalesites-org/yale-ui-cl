import { Table } from "./Table";
export default {
  title: 'Table',
  component: 'yc-table',
  argTypes: {
    label: {control: 'text'},
    
},
  args: {
    label: 'Example Table',
},

  render: (args) => 
    `<cta-link class="${args.fill} ${args.animate} ${args.radius}" href="${args.URL}">${args.label}</cta-link>`,
};

export const Default = {

  render: (args) =>
    `<yc-table>
      <table>
        <thead>
          <tr>
            <th>Header 1</th>
            <th>Header 2</th>
            <th>Header 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Content 1</td>
            <td>Content 2</td>
            <td>Content 3</td>
          </tr>
        </tbody>
      </table>
        `
};

