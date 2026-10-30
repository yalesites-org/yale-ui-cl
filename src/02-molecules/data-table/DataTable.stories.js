import "./DataTable";
import "../../01-atoms/text-link/Link";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

const courses = [
  ['CPSC 201', 'Introduction to Computer Science', 'Ozan Erat', 1, '$0', '2027-01-12', 'Jan 12, 2027'],
  ['ECON 115', 'Introductory Microeconomics', 'Rosa Lin', 1, '$0', '2027-01-13', 'Jan 13, 2027'],
  ['HIST 247', 'The Atlantic World, 1450–1850', 'Daniel Okafor', 1, '$45', '2027-01-14', 'Jan 14, 2027'],
  ['MUSI 110', 'Elements of Musical Pitch and Time', 'Hannah Weiss', 0.5, '$120', '2027-01-20', 'Jan 20, 2027'],
  ['ART 114', 'Basic Drawing', 'Marcus Chen', 1, '$250', '2027-01-12', 'Jan 12, 2027'],
  ['ENGL 120', 'Reading and Writing the Modern Essay', 'Priya Natarajan', 1, '$0', '2027-02-02', 'Feb 2, 2027'],
  ['CHEM 161', 'General Chemistry I', 'Samuel Ortiz', 1, '$75', '2027-01-15', 'Jan 15, 2027'],
  ['PLSC 113', 'Introduction to American Politics', 'Grace Liu', 1, '$0', '2027-01-19', 'Jan 19, 2027'],
];

const table = ({ presort, caption } = {}) => `
  <table>${caption ? `
    <caption>${caption}</caption>` : ''}
    <thead>
      <tr>
        <th scope="col"${attrs({ 'aria-sort': presort })}>Course</th>
        <th scope="col">Title</th>
        <th scope="col">Instructor</th>
        <th scope="col">Credits</th>
        <th scope="col">Lab fee</th>
        <th scope="col">Starts</th>
        <th scope="col" data-no-sort>Details</th>
      </tr>
    </thead>
    <tbody>
      ${courses.map(([code, title, instructor, credits, fee, iso, start]) => `
      <tr>
        <td>${code}</td>
        <td>${title}</td>
        <td>${instructor}</td>
        <td>${credits}</td>
        <td>${fee}</td>
        <td data-sort-value="${iso}">${start}</td>
        <td><text-link href="#">View</text-link></td>
      </tr>`).join('')}
    </tbody>
  </table>`;

export default {
  title: 'Molecules/Data Table',
  component: 'ycl-data-table',
  argTypes: {
    label: attributeArg('Label for the search field. Defaults to "Search".', { control: 'text' }),
    placeholder: attributeArg('Placeholder text for the search field.', { control: 'text' }),
    caption: slotArg('Caption of the slotted table. Omitted when empty.', { control: 'text' }),
    presort: slotArg('aria-sort on a header of the slotted table sorts by that column on load (shown on Course). Headers with data-no-sort are not sortable; cells can give a data-sort-value.', {
      name: 'Presorted Column',
      control: 'select',
      options: ['none', 'ascending', 'descending'],
      mapping: { none: undefined },
    }),
    content: slotArg('A `<table>` goes in the default slot; its header cells become sort buttons and the search filters its body rows.', {
      control: false,
    }),
  },
  args: {
    label: 'Search courses',
    placeholder: 'Course, title or instructor',
    caption: 'Spring 2027 courses',
    presort: 'none',
  },

  render: (args) =>
    `<ycl-data-table${attrs({ label: args.label, placeholder: args.placeholder })}>${table(args)}</ycl-data-table>`,
};

export const Default = {};
