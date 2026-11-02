import "./DataTable";
import "../../01-atoms/text-link/Link";

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

const table = ({ presort } = {}) => `
  <table>
    <caption>Spring 2027 courses</caption>
    <thead>
      <tr>
        <th scope="col"${presort ? ' aria-sort="ascending"' : ''}>Course</th>
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
        <td><ycl-text-link href="#">View</ycl-text-link></td>
      </tr>`).join('')}
    </tbody>
  </table>`;

export default {
  title: 'Molecules/Data Table',
  component: 'ycl-data-table',
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
  },
  args: {
    label: 'Search courses',
    placeholder: 'Course, title or instructor',
  },

  render: (args) =>
    `<ycl-data-table label="${args.label}" placeholder="${args.placeholder}">${table()}</ycl-data-table>`,
};

export const Default = {};

// aria-sort on a header sorts by that column on load.
export const Presorted = {
  render: (args) =>
    `<ycl-data-table label="${args.label}" placeholder="${args.placeholder}">${table({ presort: true })}</ycl-data-table>`,
};
