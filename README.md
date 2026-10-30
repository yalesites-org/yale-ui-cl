# Yale UI Component Library

`yale-ui-cl` is a set of framework-free Web Components (Custom Elements v1) for YaleSites. It is for developers who build Yale web pages and apps outside Drupal and YaleSites but want the YaleSites look.

- Components are plain `HTMLElement` subclasses. No framework is needed.
- Styles come from the YaleSites design tokens in [`@yalesites-org/tokens`](https://github.com/yalesites-org).
- Each component renders into a closed shadow DOM.
- Most tags start with `ycl-` (for example `ycl-button`, `ycl-alert`, `ycl-tabs`). A few do not yet, such as `cta-link`, `text-link`, `text-input`, `select-input` and `yc-table`.

The components are built with [Vite](https://vite.dev) and documented in [Storybook](https://storybook.js.org).

## Requirements

- Node.js and npm.
- Access to GitHub Packages. `@yalesites-org/tokens` is installed from `npm.pkg.github.com` (see `.npmrc`). Set a GitHub token with `read:packages` access in the `YALESITES_BUILD_TOKEN` environment variable before installing.

## Install

```bash
export YALESITES_BUILD_TOKEN=<your GitHub token>
npm ci
npx playwright install chromium   # once per machine, for the tests
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server for `index.html`, the manual smoke-test page. |
| `npm run storybook` | Start Storybook on port 6006. |
| `npm run build` | Build the library into `dist/`. |
| `npm run build-storybook` | Build a static Storybook into `storybook-static/`. |
| `npm run preview` | Serve the Vite build locally. |
| `npm test` | Run all tests once in headless Chromium (unit tests and Storybook story tests). |
| `npm run test:watch` | Run the tests in watch mode. |
| `npx eslint .` | Lint the project. |

To run one test project only, use `npm test -- --project unit` or `npm test -- --project storybook`.

The Storybook tests render every story and run accessibility (axe) checks on it. Any violation fails the run.

## Using the built library

The package is not published yet. Build it with `npm run build`, then install it from a local path (`npm install ../path/to/yale-ui-cl`) or copy the `dist/` folder.

`npm run build` writes:

- `dist/yale-ui-cl.js`: the full bundle as an ES module (also `dist/yale-ui-cl.umd.cjs` for UMD/CommonJS).
- `dist/yale-ui-cl.css`: the document styles (design tokens, reset, typography, component styles).
- `dist/<name>.js`: one ES entry per component, named after its tag with any `ycl-` or `yc-` prefix removed (for example `button`, `accordion`, `data-table`, `table`, `cta-link`).

Always load the stylesheet. Then load either the full bundle or the components you need:

```js
import 'yale-ui-cl/style.css';

// Every component:
import 'yale-ui-cl';

// Or just one:
import 'yale-ui-cl/button';
```

```html
<ycl-button class="filled radius-soft" href="https://www.yale.edu">Visit Yale</ycl-button>
```

Loading the same component from a single entry and from the full bundle is safe; each tag is registered once.

## Project layout

```text
src/
  00-tokens/       Token-level styles (typography)
  01-atoms/        Small single-purpose components (button, text input, icon, ...)
  02-molecules/    Components built from atoms (alert, accordion, tabs, cards, ...)
  styles/          Document styles (base.css) and shared shadow-root styles (shadow.css, shadow.js)
  main.js          Public entry point: imports base.css and exports every component class
  input.js         Shared form-input behaviour
  utility.js       Shared DOM helpers
  Welcome.mdx      Storybook landing page
postcss/
  lock-tokens.js   Build-time PostCSS plugin that locks token values in component CSS
.storybook/        Storybook configuration
test/              Test helpers and setup
index.html         Manual smoke-test page served by `npm run dev`
```

Each component directory holds the component class, its CSS, its stories (`*.stories.js`) and its unit tests (`*.test.js`).

`postcss/lock-tokens.js` replaces most token references in component CSS with literal values at build time, so a page cannot restyle components by redefining tokens. Tokens listed in its `THEMEABLE` set stay as `var()` with the resolved value as a fallback.

`index.html` is not part of Storybook. It is a plain page that loads `src/main.js` and shows the components with their slots and attributes. Use it for manual smoke testing with `npm run dev`.
