import "./WrappedCallout";
import "../../01-atoms/text-link/Link";

const body = `
  <p>HRBPs work closely with departmental leadership on strategic initiatives related to their workforce and work environments. This includes supporting positive relations between management and staff, alignment with university policies, and developing strategies geared towards talent, engagement, wellness, or belonging for the organization and its employees who are at the heart of it all.</p>
  <p>“We are here to help provide solutions and offer an understanding of the unit’s culture and climate to leadership,” said Tricia Napor, senior director of employee relations. “A new leader may want to reorganize their team in a way that requires thoughtful change management. A manager might require help understanding how to repurpose a role on their team or how to interpret a policy.”</p>
  <p>HRBPs assess staffing needs and support departments during the hiring process in partnership with the Talent Acquisition team. They work with staff throughout their employment at Yale and play a critical role in talent planning and the performance management and merit processes.</p>`;

export default {
  title: 'Wrapped Callout',
  component: 'ycl-wrapped-callout',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    alignment: {
      name: 'Callout Alignment',
      type: 'select',
      options: ['left', 'right'],
    },
    calloutHeading: {name: 'Callout Heading', control: 'text'},
    showContent: {name: 'Show Body Text', control: 'boolean'},
    theme: {
      name: 'Component Theme',
      type: 'select',
      options: ['default', 'one', 'two', 'three', 'four', 'five', 'six'],
    },
    globalTheme: {
      name: 'Site Global Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
  },
  args: {
    alignment: 'left',
    calloutHeading: 'Find Your Human Resources Business Partner',
    showContent: true,
    theme: 'one',
    globalTheme: 'one',
  },

  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-wrapped-callout alignment="${args.alignment}" theme="${args.theme}">
        <h2 slot="callout">${args.calloutHeading}</h2>
        <p slot="callout"><text-link href="https://www.myworkday.com" target="_blank">Find your HR Business Partner</text-link> by department, manager, or campus location in Workday.</p>
        ${args.showContent ? body : ''}
      </ycl-wrapped-callout>
    </div>`,
};

export const Default = {};

export const RightAligned = {
  args: {
    alignment: 'right',
  },
};

export const CalloutOnly = {
  args: {
    showContent: false,
  },
};

export const Themed = {
  args: {
    theme: 'three',
  },
};
