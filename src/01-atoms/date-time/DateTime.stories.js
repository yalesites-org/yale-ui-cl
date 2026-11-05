import "./DateTime";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Atoms/Date Time',
  component: 'ycl-date-time',
  argTypes: {
    start: attributeArg('start: ISO 8601 date or Unix timestamp in seconds. Without a parseable start, the slotted fallback shows.', {
      name: 'Start (ISO 8601)',
      control: 'text',
    }),
    end: attributeArg('end: optional end of a range. Omitted when empty.', { name: 'End (ISO 8601)', control: 'text' }),
    format: attributeArg('format: named display format (matches the Twig template\'s formats).', {
      name: 'Format',
      control: 'select',
      options: [
        'date_and_time', 'time', 'date', 'day__full', 'day__long', 'month_year', 'year_only',
        'same_day_diff_time', 'date_time_multiple_days', 'localist_same_day', 'localist_all_day',
      ],
    }),
    allDay: attributeArg('all-day: show only the date(s) followed by "All day".', { name: 'All day', control: 'boolean' }),
    timeZone: attributeArg('time-zone: IANA time zone to display in. Defaults to the visitor\'s local time.', {
      name: 'Time zone',
      control: 'text',
    }),
    fallback: slotArg('Default slot: text shown when there is no parseable start date. Omitted when empty.', { control: 'text' }),
  },
  args: {
    start: '2026-10-14T18:30:00-04:00',
    end: '',
    format: 'date_and_time',
    allDay: false,
    timeZone: 'America/New_York',
    fallback: 'Date to be announced',
  },
  render: (args) => `<p>
      <ycl-date-time${attrs({
        start: args.start,
        end: args.end,
        format: args.format,
        'all-day': args.allDay,
        'time-zone': args.timeZone,
      })}>${args.fallback ?? ''}</ycl-date-time>
    </p>`,
};

export const Default = {};
