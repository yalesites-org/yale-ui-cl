import "./Heading";
export default {
  title: 'Atoms/Heading',
  component: 'ycl-heading',
  argTypes: {
    heading: { control: 'text' },
    level: {
      name: 'Heading level',
      type: 'select',
      options: ['1', '2', '3', '4', '5', '6'],
    },
    appearance: {
      name: 'Visual style',
      type: 'select',
      options: ['', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    },
    prefix: { control: 'text' },
    href: { name: 'Link URL', control: 'text' },
  },
  args: {
    heading: 'Yale University Art Gallery',
    level: '2',
    appearance: '',
    prefix: '',
    href: '',
  },
  render: (args) =>
    `<ycl-heading level="${args.level}"${args.appearance ? ` appearance="${args.appearance}"` : ''}${args.prefix ? ` prefix="${args.prefix}"` : ''}${args.href ? ` href="${args.href}"` : ''}>${args.heading}</ycl-heading>`,
};

export const Default = {};

export const AllLevels = {
  render: () =>
    ['1', '2', '3', '4', '5', '6'].map((level) =>
      `<ycl-heading level="${level}" style="margin-bottom: 1rem;">Heading level ${level}</ycl-heading>`).join(''),
};

export const WithPrefix = {
  args: {
    prefix: 'Exhibition',
    heading: 'Pathways to Modernism',
  },
};

export const Linked = {
  args: {
    level: '3',
    heading: 'Undergraduate Admissions',
    href: 'https://admissions.yale.edu',
  },
};

export const LevelDiffersFromStyle = {
  args: {
    level: '2',
    appearance: 'h5',
    heading: 'An h2 in the outline, styled as an h5',
  },
};

export const WithPrefixIcon = {
  render: () =>
    `<ycl-heading level="3" prefix-icon="calendar-solid">Upcoming Events</ycl-heading>`,
};
