import "./NavMenu";
export default {
  title: 'Molecules/Navigation Menu',
  component: 'ycl-nav-menu',
  argTypes: {
    layout: {
      name: 'Layout',
      type: 'select',
      options: ['horizontal', 'vertical'],
    },
    label: {control: 'text'},
},
  args: {
    layout: 'horizontal',
    label: 'Main',
},

  render: (args) =>
    `<ycl-nav-menu layout="${args.layout}" label="${args.label}">
      <ycl-nav-menu-item label="Home" href="#"></ycl-nav-menu-item>
      <ycl-nav-menu-item label="About">
        <ycl-nav-menu-item label="History" href="#"></ycl-nav-menu-item>
        <ycl-nav-menu-item label="Leadership" href="#" current></ycl-nav-menu-item>
        <ycl-nav-menu-item label="Facts and figures" href="#"></ycl-nav-menu-item>
      </ycl-nav-menu-item>
      <ycl-nav-menu-item label="Academics">
        <ycl-nav-menu-item label="Undergraduate programs" href="#"></ycl-nav-menu-item>
        <ycl-nav-menu-item label="Graduate programs" href="#"></ycl-nav-menu-item>
        <ycl-nav-menu-item label="Course catalog" href="#"></ycl-nav-menu-item>
      </ycl-nav-menu-item>
      <ycl-nav-menu-item label="News" href="#"></ycl-nav-menu-item>
      <ycl-nav-menu-item label="Contact" href="#"></ycl-nav-menu-item>
    </ycl-nav-menu>`,
};

// Primary navigation: dropdowns float below their toggle and close on Escape, an outside click,
// or when focus leaves the menu.
export const Horizontal = {};

// Secondary (section) navigation, and the mobile menu: dropdowns expand inline.
export const Vertical = {
  args: {
    layout: 'vertical',
    label: 'About',
  },
  render: (args) =>
    `<div style="max-width: 20rem">
      <ycl-nav-menu layout="${args.layout}" label="${args.label}">
        <ycl-nav-menu-item label="Overview" href="#"></ycl-nav-menu-item>
        <ycl-nav-menu-item label="History">
          <ycl-nav-menu-item label="Founding" href="#"></ycl-nav-menu-item>
          <ycl-nav-menu-item label="Timeline" href="#"></ycl-nav-menu-item>
        </ycl-nav-menu-item>
        <ycl-nav-menu-item label="Leadership" href="#" current></ycl-nav-menu-item>
        <ycl-nav-menu-item label="Campus">
          <ycl-nav-menu-item label="Maps" href="#"></ycl-nav-menu-item>
          <ycl-nav-menu-item label="Visiting" href="#"></ycl-nav-menu-item>
        </ycl-nav-menu-item>
        <ycl-nav-menu-item label="Contact" href="#"></ycl-nav-menu-item>
      </ycl-nav-menu>
    </div>`,
};
