import "./Alert";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/text-link/Link";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

const resetButton = `<p><button type="button" onclick="Object.keys(localStorage).filter((k) => k.startsWith('ys-alert-id-')).forEach((k) => localStorage.removeItem(k)); location.reload();">Reset dismissed alerts</button></p>`;

const alertMarkup = (args) =>
  `<ycl-alert${attrs({ type: args.type, state: args.state, 'alert-id': args.alertId })}>${args.heading ? `
      <ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : ''}${args.content ? `
      <p>${args.content}</p>` : ''}${args.linkContent ? `
      <text-link slot="link" href="https://www.yale.edu">${args.linkContent}</text-link>` : ''}
    </ycl-alert>`;

export default {
  title: 'Molecules/Site Alert',
  component: 'ycl-alert',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    type: attributeArg('Alert type. Emergency alerts collapse; the others are dismissed. Defaults to announcement.', {
      name: 'Alert Type',
      control: 'select',
      options: ['emergency', 'announcement', 'marketing'],
    }),
    state: attributeArg('Current state; updated when the toggle is clicked. Defaults to expanded.', {
      control: 'select',
      options: ['expanded', 'collapsed', 'dismissed'],
      mapping: { expanded: undefined },
    }),
    alertId: attributeArg('alert-id: remembers the collapsed/dismissed state in localStorage when set (a reset button appears below).', {
      name: 'Alert ID',
      control: 'text',
    }),
    heading: slotArg('Alert heading (slot="heading"). Omitted when empty.', { control: 'text' }),
    content: slotArg('Alert text (default slot). Omitted when empty.', { control: 'text' }),
    linkContent: slotArg('Link (slot="link"). Omitted when empty.', { name: 'Link Text', control: 'text' }),
  },
  args: {
    type: 'announcement',
    state: 'expanded',
    heading: 'This is the heading for the alert',
    content: 'This is an optional text for more information if needed.',
    linkContent: 'Optional link',
    alertId: '',
  },

  render: (args) => `${alertMarkup(args)}
    ${args.alertId ? resetButton : ''}`,
};

export const Default = {};

export const AllTypes = {
  parameters: {
    docs: {
      description: {
        story: 'All three alert types stacked for comparison. Controls render one alert at a time, so they cannot show the types side by side.',
      },
    },
  },
  render: (args) =>
    ['emergency', 'announcement', 'marketing'].map((type) => alertMarkup({ ...args, type, alertId: '' })).join(''),
};
