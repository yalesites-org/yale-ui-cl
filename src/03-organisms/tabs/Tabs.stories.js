import "./Tabs";
import "../../01-atoms/text-link/Link";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";
import { COLOR_OPTION_DESCRIPTION, colorOptionLabels } from "../../00-tokens/theme/color-options.js";

const tabs = (args, content) => `
      <ycl-tabs${attrs({ theme: args.theme, label: args.label })}>
        ${content}
      </ycl-tabs>`;

export default {
  title: 'Organisms/Tabs',
  component: 'ycl-tabs',
  argTypes: {
    theme: attributeArg(COLOR_OPTION_DESCRIPTION, {
      name: 'Color Option',
      options: ['primary', 'secondary', 'accent-2'],
      mapping: { primary: undefined },
      control: { type: 'select', labels: colorOptionLabels('ycl-tabs') },
    }),
    label: attributeArg('Accessible name for the tab list.', { control: 'text' }),
    tabs: slotArg('ycl-tab elements in the default slot. Each takes a label attribute (the tab text) and an optional selected attribute; its content is the panel.', {
      control: false,
    }),
  },
  args: {
    theme: 'primary',
    label: 'Registration',
  },

  render: (args) => tabs(args, `<ycl-tab label="Before registration">
          <p>Review the <ycl-text-link href="#">course catalog</ycl-text-link> and meet with your adviser to plan your schedule. Check that any prerequisites are complete and that you have no holds on your account.</p>
        </ycl-tab>
        <ycl-tab label="During registration">
          <p>Registration opens by class year. Add courses to your worksheet ahead of time so you can submit as soon as your window opens.</p>
          <p>If a course is full, join the <ycl-text-link href="#">waitlist</ycl-text-link> and check back regularly.</p>
        </ycl-tab>
        <ycl-tab label="Year-round">
          <p>Keep your contact details up to date and review the <ycl-text-link href="#">academic calendar</ycl-text-link> for add/drop deadlines.</p>
        </ycl-tab>`),
};

export const Default = {};

export const ManyTabs = {
  args: {
    label: 'Schools',
  },
  parameters: {
    docs: {
      description: {
        story: 'Twelve tabs, with the third selected, overflow the tab list so the scroll buttons appear (narrow the preview to see them). The set of slotted ycl-tab elements is markup, not an attribute, so controls cannot add tabs.',
      },
    },
  },
  render: (args) => tabs(args, ['Architecture', 'Art', 'Divinity', 'Drama', 'Engineering & Applied Science', 'Environment', 'Law', 'Management', 'Medicine', 'Music', 'Nursing', 'Public Health']
    .map((school, i) => `<ycl-tab${attrs({ label: school, selected: i === 2 })}><p>Information about the School of ${school}.</p></ycl-tab>`)
    .join('')),
};
