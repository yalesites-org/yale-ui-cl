import "./SiteHeader";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

const menu = `<ycl-nav-menu label="Main">
        <ycl-nav-menu-item label="Home" href="#"></ycl-nav-menu-item>
        <ycl-nav-menu-item label="About">
          <ycl-nav-menu-item label="History" href="#"></ycl-nav-menu-item>
          <ycl-nav-menu-item label="Leadership" href="#" current></ycl-nav-menu-item>
          <ycl-nav-menu-item label="Facts and figures" href="#"></ycl-nav-menu-item>
        </ycl-nav-menu-item>
        <ycl-nav-menu-item label="Academics">
          <ycl-nav-menu-item label="Undergraduate programs" href="#"></ycl-nav-menu-item>
          <ycl-nav-menu-item label="Graduate programs" href="#"></ycl-nav-menu-item>
        </ycl-nav-menu-item>
        <ycl-nav-menu-item label="News" href="#"></ycl-nav-menu-item>
        <ycl-nav-menu-item label="Contact" href="#"></ycl-nav-menu-item>
      </ycl-nav-menu>`;

export default {
  title: 'Organisms/Site Header',
  component: 'ycl-site-header',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'One generic Yale header: the wordmark, the site name and primary navigation. Put one `ycl-nav-menu` inside it; the header sets its `layout`, horizontal on screens 992px and wider and vertical behind a Menu toggle below that. Escape closes the open mobile menu and returns focus to the toggle.',
      },
    },
  },
  argTypes: {
    siteName: attributeArg('Name of the site, shown next to the wordmark.', { name: 'site-name', control: 'text' }),
    href: attributeArg('Where the site name links. Defaults to /.', { control: 'text' }),
    menu: slotArg('One ycl-nav-menu, the primary navigation.', { control: false }),
  },
  args: {
    siteName: 'Office of Example Studies',
    href: '#',
  },
  render: (args) => `<ycl-site-header${attrs({ 'site-name': args.siteName, href: args.href })}>
      ${menu}
    </ycl-site-header>`,
};

export const Default = {};

// The narrow layout: the menu sits behind the Menu toggle and opens in its vertical layout.
export const Mobile = {
  globals: {
    viewport: { value: 'mobile1' },
  },
};
