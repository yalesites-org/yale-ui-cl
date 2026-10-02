import "./Tabs";
export default {
  title: 'Tabs',
  component: 'ycl-tabs',
  argTypes: {
    theme: {
      name: 'Component Theme',
      type: 'select',
      options: ['one', 'two', 'three'],
    },
    globalTheme: {
      name: 'Site Global Theme',
      type: 'select',
      options: ['one', 'two', 'three', 'four', 'five', 'six'],
    },
},
  args: {
    theme: 'one',
    globalTheme: 'one',
},

  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-tabs theme="${args.theme}" label="Registration">
        <ycl-tab label="Before registration">
          <p>Review the <a href="#">course catalog</a> and meet with your adviser to plan your schedule. Check that any prerequisites are complete and that you have no holds on your account.</p>
        </ycl-tab>
        <ycl-tab label="During registration">
          <p>Registration opens by class year. Add courses to your worksheet ahead of time so you can submit as soon as your window opens.</p>
          <p>If a course is full, join the <a href="#">waitlist</a> and check back regularly.</p>
        </ycl-tab>
        <ycl-tab label="Year-round">
          <p>Keep your contact details up to date and review the <a href="#">academic calendar</a> for add/drop deadlines.</p>
        </ycl-tab>
      </ycl-tabs>
    </div>`,
};

export const Default = {};

export const ThemeTwo = {
  args: {
    theme: 'two',
  },
};

// Narrow the preview to see the scroll buttons appear.
export const ManyTabs = {
  render: (args) =>
    `<div data-global-theme="${args.globalTheme}">
      <ycl-tabs theme="${args.theme}" label="Schools">
        ${['Architecture', 'Art', 'Divinity', 'Drama', 'Engineering & Applied Science', 'Environment', 'Law', 'Management', 'Medicine', 'Music', 'Nursing', 'Public Health']
          .map((school, i) => `<ycl-tab label="${school}"${i === 2 ? ' selected' : ''}><p>Information about the School of ${school}.</p></ycl-tab>`)
          .join('')}
      </ycl-tabs>
    </div>`,
};
