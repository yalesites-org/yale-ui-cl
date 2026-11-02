import "./Table";
export default {
  title: 'Atoms/Table',
  component: 'ycl-table',
  argTypes: {
    label: {control: 'text'},
    
},
  args: {
    label: 'Example Table',
},
};

export const Default = {

  render: () =>
    `<ycl-table>
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
    </ycl-table>
        `
};

