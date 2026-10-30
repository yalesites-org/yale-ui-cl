import "./LinkSkip";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";
export default {
  title: 'Molecules/Link Skip',
  component: 'ycl-link-skip',
  argTypes: {
    url: attributeArg('Target of the skip link; defaults to #main-content.', { name: 'href', control: 'text' }),
    content: slotArg('Link text (default slot); falls back to "Skip to main content".', { control: 'text' }),
  },
  args: {
    content: 'Skip to main content',
    url: '#main-content',
  },

  render: (args) =>
    `<ycl-link-skip${attrs({ href: args.url })}>${args.content ?? ''}</ycl-link-skip>
    <p>The skip link is hidden until it receives keyboard focus. Click here, then press Shift+Tab or Tab to reveal it.</p>
    <main id="main-content" tabindex="-1">
      <h2>Main content</h2>
      <p>Activating the skip link moves you here.</p>
    </main>`,
};

export const Default = {};
