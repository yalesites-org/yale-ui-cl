import "./Alert";
import "../../01-atoms/text-link/Link";

const resetButton = `<p><button type="button" onclick="Object.keys(localStorage).filter((k) => k.startsWith('ys-alert-id-')).forEach((k) => localStorage.removeItem(k)); location.reload();">Reset dismissed alerts</button></p>`;

export default {
  title: 'Site Alert',
  component: 'ycl-alert',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    type: {
      name: 'Alert Type',
      type: 'select',
      options: ['emergency', 'announcement', 'marketing'],
    },
    heading: {control: 'text'},
    content: {control: 'text'},
    linkContent: {name: 'Link Text', control: 'text'},
    alertId: {
      name: 'Alert ID',
      control: 'text',
      description: 'Remembers the collapsed/dismissed state in localStorage when set.',
    },
  },
  args: {
    type: 'announcement',
    heading: 'This is the heading for the alert',
    content: 'This is an optional text for more information if needed.',
    linkContent: 'Optional link',
    alertId: '',
  },

  render: (args) =>
    `<ycl-alert type="${args.type}"${args.alertId ? ` alert-id="${args.alertId}"` : ''}>
      <h2 slot="heading">${args.heading}</h2>
      <p>${args.content}</p>
      <text-link slot="link" href="https://www.yale.edu">${args.linkContent}</text-link>
    </ycl-alert>
    ${args.alertId ? resetButton : ''}`,
};

export const Default = {};

export const Emergency = {
  args: {
    type: 'emergency',
  },
};

export const Marketing = {
  args: {
    type: 'marketing',
  },
};

export const Remembered = {
  args: {
    alertId: '123',
  },
};

export const AllTypes = {
  render: (args) =>
    ['emergency', 'announcement', 'marketing'].map((type) =>
      `<ycl-alert type="${type}">
        <h2 slot="heading">${args.heading}</h2>
        <p>${args.content}</p>
        <text-link slot="link" href="https://www.yale.edu">${args.linkContent}</text-link>
      </ycl-alert>`).join(''),
};
