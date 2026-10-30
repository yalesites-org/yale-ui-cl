import "./Table";
import { slotArg } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Atoms/Table',
  component: 'yc-table',
  argTypes: {
    caption: slotArg('Table caption, shown below the table. Omitted when empty.', { control: 'text' }),
    rowHeaders: slotArg('Make the first cell of each body row a row header (`<th scope="row">`).', { name: 'Row Headers', control: 'boolean' }),
    rows: slotArg('Number of body rows. Rows alternate stripes, so use several to see them.', {
      control: { type: 'number', min: 1, max: 10 },
    }),
    content: slotArg('A `<table>` goes in the default slot; the component wraps it so wide tables scroll.', { control: false }),
  },
  args: {
    caption: 'Example table',
    rowHeaders: false,
    rows: 4,
  },
  render: (args) => {
    const count = Math.max(1, Number(args.rows) || 1);
    const rows = Array.from({ length: count }, (_, i) => {
      const first = args.rowHeaders ? `<th scope="row">Row ${i + 1}</th>` : `<td>Content ${i + 1}.1</td>`;
      return `
          <tr>
            ${first}
            <td>Content ${i + 1}.2</td>
            <td>Content ${i + 1}.3</td>
          </tr>`;
    }).join('');
    return `<yc-table>
      <table>${args.caption ? `
        <caption>${args.caption}</caption>` : ''}
        <thead>
          <tr>
            <th scope="col">Header 1</th>
            <th scope="col">Header 2</th>
            <th scope="col">Header 3</th>
          </tr>
        </thead>
        <tbody>${rows}
        </tbody>
      </table>
    </yc-table>`;
  },
};

export const Default = {};
