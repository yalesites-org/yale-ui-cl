/* @type { import('@storybook/web-components--vite').Preview ) */

import ('../src/styles/base.css');

// The web-components source decorator renders story output with lit; when a
// story returns an HTML string, lit treats it as text, so the serialized
// snippet comes back entity-escaped. Undo that one level of escaping.
const unescapeStringSource = (code) => {
	if (!code.startsWith('&lt;')) return code;
	return code
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&');
};

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
		source: {
			transform: unescapeStringSource,
		},
	},
  },
};

export default preview;
