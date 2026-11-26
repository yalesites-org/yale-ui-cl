import "./Calendar";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

// Sample events for November 2026, with today fixed to November 12 so the story looks the same every day.
const sampleEvents = [
  { start: '2026-11-03T12:00', end: '2026-11-03T13:00', title: 'Lunchtime lecture: Libraries and memory', location: 'Sterling Memorial Library', href: '#' },
  { start: '2026-11-06T16:00', end: '2026-11-06T17:30', title: 'Graduate student colloquium', location: 'Kline Tower, Room 101' },
  { start: '2026-11-12T10:00', end: '2026-11-12T11:00', title: 'Office hours with the dean', location: 'Warner House', href: '#' },
  { start: '2026-11-12T16:00', end: '2026-11-12T17:30', title: 'Environmental humanities lecture with a long title that wraps onto a second line', location: 'Kroon Hall', href: '#' },
  { start: '2026-11-12T19:30', title: 'Yale Glee Club fall concert', location: 'Woolsey Hall', href: '#' },
  { start: '2026-11-12T21:00', title: 'Late-night study break', location: 'Commons' },
  { start: '2026-11-17T15:00', end: '2026-11-17T16:00', title: 'Career workshop: writing a CV', location: 'Online' },
  { start: '2026-11-20', end: '2026-11-22', title: 'Symposium on urban ecology', location: 'Yale School of the Environment', href: '#' },
];

const eventMarkup = (events) => events
  .map(({ title, ...rest }) => `<ycl-calendar-event${attrs(rest)}>${title}</ycl-calendar-event>`)
  .join('\n        ');

const calendar = (args, events) => `
      <ycl-calendar${attrs({ month: args.month, today: args.today, label: args.label })}>
        ${eventMarkup(events)}
      </ycl-calendar>`;

export default {
  title: 'Organisms/Calendar',
  component: 'ycl-calendar',
  argTypes: {
    month: attributeArg('Month to show first, as YYYY-MM. Defaults to the month of today.', { control: 'text' }),
    today: attributeArg("Overrides today's date, as YYYY-MM-DD. Pages leave it unset; the stories fix it so they look the same every day.", { control: 'text' }),
    label: attributeArg('Accessible name of the calendar. Defaults to "Event calendar".', { control: 'text' }),
    events: slotArg('ycl-calendar-event elements in the default slot. Each takes start (a date or local date-time), and optional end, href and location attributes; its text is the title.', {
      control: false,
    }),
  },
  args: {
    today: '2026-11-12',
    label: 'Department events',
  },
  parameters: {
    docs: {
      description: {
        component: 'A compact month calendar beside a list of events, after the "Calendar with event list" design (YaleSites-Internal#955). Today is selected on load and the list runs from the selected day to the end of the month. Days with events are bold with up to three dots, then a "+". Event data comes from the page as ycl-calendar-event children, with no Localist or Drupal dependency. Keyboard: Tab to the day grid, arrow keys move by day and week, Home and End go to the start and end of the week, Page Up and Page Down change month, Enter or Space selects a day.',
      },
    },
  },
  render: (args) => calendar(args, sampleEvents),
};

export const Default = {};

export const PastMonth = {
  args: { month: '2026-10' },
  parameters: {
    docs: { description: { story: 'A month with no events shows a message instead of an empty list.' } },
  },
};

export const PastEvents = {
  args: { today: '2026-12-02', month: '2026-11' },
  parameters: {
    docs: { description: { story: 'An earlier month lists all its events from the first. Past events get a gray badge and "Past event".' } },
  },
};
