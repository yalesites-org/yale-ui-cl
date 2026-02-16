/* @type { import('@storybook/html-vite').Preview ) */

import ('../src/styles/base.css');

const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
	docs: {
		codePanel: true,
	},
  },
};

export default preview;
