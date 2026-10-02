import "./DateTime";
export default {
  title: 'Date Time',
  component: 'ycl-date-time',
  argTypes: {
    start: { name: 'Start (ISO 8601)', control: 'text' },
    end: { name: 'End (ISO 8601)', control: 'text' },
    format: {
      name: 'Format',
      type: 'select',
      options: [
        'date_and_time', 'time', 'date', 'day__full', 'day__long', 'month_year', 'year_only',
        'same_day_diff_time', 'date_time_multiple_days', 'localist_same_day', 'localist_all_day',
      ],
    },
    allDay: { name: 'All day', control: 'boolean' },
    timeZone: { name: 'Time zone', control: 'text' },
  },
  args: {
    start: '2026-10-14T18:30:00-04:00',
    end: '',
    format: 'date_and_time',
    allDay: false,
    timeZone: 'America/New_York',
  },
  render: (args) =>
    `<p>
      <ycl-date-time start="${args.start}"${args.end ? ` end="${args.end}"` : ''} format="${args.format}"${args.allDay ? ' all-day' : ''}${args.timeZone ? ` time-zone="${args.timeZone}"` : ''}></ycl-date-time>
    </p>`,
};

export const Default = {};

export const Time = {
  args: { format: 'time' },
};

export const TimeRange = {
  args: {
    format: 'same_day_diff_time',
    end: '2026-10-14T20:00:00-04:00',
  },
};

export const MultipleDays = {
  args: {
    format: 'date_time_multiple_days',
    end: '2026-10-16T17:00:00-04:00',
  },
};

export const AllDay = {
  args: {
    start: '2026-07-01T00:00:00-04:00',
    end: '2026-07-05T00:00:00-04:00',
    allDay: true,
  },
};

export const LongDate = {
  args: { format: 'day__long' },
};
