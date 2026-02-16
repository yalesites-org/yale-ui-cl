/* @type { import('@storybook/html-vite').Preview ) */
<<<<<<< HEAD
import '../src/styles/base.css';
=======

import '../src/styles/base.css';
>>>>>>> preview_update

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
