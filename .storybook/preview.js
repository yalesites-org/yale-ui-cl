/* @type { import('@storybook/web-components--vite').Preview ) */

import { setCustomElementsManifest } from '@storybook/web-components-vite';
import customElements from '../custom-elements.json';

import ('../src/styles/base.css');

// Docs pages read each component's description, attributes, slots, events and CSS parts from the
// manifest (generated from the components' JSDoc by `npm run analyze`), so they can't drift from
// the code. A story's own argTypes are merged over the manifest's.
setCustomElementsManifest(customElements);

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
  // A Docs page for every component, built from the manifest entry for its component tag.
  tags: ['autodocs'],
  parameters: {
    // Axe violations fail the story's test (npm test) instead of only being reported.
    a11y: {
      test: 'error',
    },
    options: {
      // Group by atomic tier, then alphabetize components within a tier while
      // keeping each file's own story order. Storybook serializes this
      // function, so it can't reference anything outside its body.
      storySort: (a, b) => {
        const tiers = ['Configure your project', 'Tokens', 'Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages'];
        const rank = (title) => {
          const i = tiers.indexOf(title.split('/')[0]);
          return i === -1 ? tiers.length : i;
        };
        if (a.title === b.title) return 0;
        return rank(a.title) - rank(b.title) || a.title.localeCompare(b.title);
      },
    },
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
