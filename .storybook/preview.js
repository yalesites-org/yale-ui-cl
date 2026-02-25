/* @type { import('@storybook/web-components--vite').Preview ) */

import ('../src/style.scss');

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
