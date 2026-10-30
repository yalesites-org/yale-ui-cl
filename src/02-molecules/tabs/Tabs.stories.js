import "./Tabs";
import "../../01-atoms/text-link/Link";
import { attrs, attributeArg, slotArg, globalThemeArgType, withGlobalTheme } from "../../../.storybook/story-helpers.js";

const tabs = (args, content) => withGlobalTheme(args.globalTheme, `
      <ycl-tabs${attrs({ theme: args.theme, label: args.label })}>
        ${content}
      </ycl-tabs>`);

export default {
  title: 'Molecules/Tabs',
  component: 'ycl-tabs',
  argTypes: {
    theme: attributeArg('Color theme; one is the default.', {
      name: 'Component Theme',
      control: 'select',
      options: ['one', 'two', 'three'],
      mapping: { one: undefined },
    }),
    label: attributeArg('Accessible name for the tab list.', { control: 'text' }),
    tabs: slotArg('ycl-tab elements in the default slot. Each takes a label attribute (the tab text) and an optional selected attribute; its content is the panel.', {
      control: false,
    }),
    globalTheme: globalThemeArgType,
  },
  args: {
    theme: 'one',
    label: 'Registration',
    globalTheme: 'one',
  },

  render: (args) => tabs(args, `<ycl-tab label="Before registration">
          <p>Review the <text-link href="#">course catalog</text-link> and meet with your adviser to plan your schedule. Check that any prerequisites are complete and that you have no holds on your account.</p>
        </ycl-tab>
        <ycl-tab label="During registration">
          <p>Registration opens by class year. Add courses to your worksheet ahead of time so you can submit as soon as your window opens.</p>
          <p>If a course is full, join the <text-link href="#">waitlist</text-link> and check back regularly.</p>
        </ycl-tab>
        <ycl-tab label="Year-round">
          <p>Keep your contact details up to date and review the <text-link href="#">academic calendar</text-link> for add/drop deadlines.</p>
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
