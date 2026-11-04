# Yale UI Component Library

`yale-ui-cl` is an open set of framework-free Web Components (Custom Elements v1). It is for developers who build Yale web pages and apps, in plain HTML or alongside any framework.

- Components are plain `HTMLElement` subclasses. No framework is needed.
- Styles come from the YaleSites design tokens in [`@yalesites-org/tokens`](https://github.com/yalesites-org).
- Each component renders into a closed shadow DOM.
- Every tag starts with `ycl-` (for example `ycl-button`, `ycl-alert`, `ycl-tabs`).

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
- `dist/<name>.js`: one ES entry per component, named after its tag with the `ycl-` prefix removed (for example `button`, `accordion`, `data-table`, `table`, `cta-link`).

Always load the stylesheet. Then load either the full bundle or the components you need:

```js
import 'yale-ui-cl/style.css';

// Every component:
import 'yale-ui-cl';

// Or just one:
import 'yale-ui-cl/button';
```

```html
<ycl-button variant="filled" radius="soft" href="https://www.yale.edu">Visit Yale</ycl-button>
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

## Theming

Components share one color theme. A page sets its palette with five custom properties on any
ancestor of the components (usually `:root`). Custom properties inherit into the components' shadow
roots, so this works without the document stylesheet (`yale-ui-cl/style.css`). Any property a page
leaves unset falls back to its Old Blues default:

| Custom property            | Option name | Default (Old Blues token) |
| -------------------------- | ----------- | ------------------------- |
| `--color-theme-primary`    | `primary`   | `--color-blue-yale`       |
| `--color-theme-secondary`  | `secondary` | `--color-blue-medium`     |
| `--color-theme-tertiary`   | `tertiary`  | `--color-blue-light`      |
| `--color-theme-accent-1`   | `accent-1`  | `--color-gray-100`        |
| `--color-theme-accent-2`   | `accent-2`  | `--color-gray-800`        |

```css
:root {
  --color-theme-primary: #00366b;
  --color-theme-secondary: #276bbe;
}
```

Each themed component picks a palette color with its `theme` attribute, named after the palette
color it takes its background (or accent) from. Without the attribute a component uses its
default option, so the attribute is only needed for the others:

```html
<ycl-callout theme="secondary">…</ycl-callout>
```

| Component                          | Options (palette order, the component's default in bold)               |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `ycl-accordion`                    | **`default`** (no accent), `primary`, `secondary`, `tertiary`, `accent-1`, `accent-2` |
| `ycl-action-banner`                | **`primary`**, `secondary`, `tertiary`, `accent-1`, `accent-2`         |
| `ycl-callout`                      | **`primary`**, `secondary`, `tertiary`, `accent-1`, `accent-2`         |
| `ycl-content-spotlight-portrait`   | **`default`** (no background), `primary`, `secondary`, `tertiary`, `accent-1`, `accent-2` |
| `ycl-facts-and-figures`            | `default` (no background), **`primary`**, `secondary`, `tertiary`, `accent-1`, `accent-2` |
| `ycl-image-banner`                 | **`primary`**, `secondary`, `tertiary`, `accent-1`, `accent-2`         |
| `ycl-inline-message`               | `primary`, `secondary`, `tertiary`, **`accent-1`**, `accent-2`         |
| `ycl-link-grid`                    | **`primary`**, `secondary`, `tertiary`, `accent-1`, `accent-2`         |
| `ycl-pull-quote`                   | **`primary`**, `tertiary`, `accent-2`                                  |
| `ycl-quick-links`                  | **`primary`**, `accent-1`, `accent-2`                                  |
| `ycl-quote-callout`                | **`primary`**, `secondary`, `tertiary`, `accent-1`, `accent-2`         |
| `ycl-tabs`                         | **`primary`**, `secondary`, `accent-2`                                 |
| `ycl-taxonomy-display`             | **`default`** (no background), `primary`, `secondary`, `tertiary`, `accent-1`, `accent-2` |
| `ycl-text-with-image`              | **`default`** (no background), `primary`, `secondary`, `tertiary`, `accent-1`, `accent-2` |
| `ycl-tile-item`                    | **`primary`**, `secondary`, `tertiary`, `accent-1`, `accent-2`         |
| `ycl-wrapped-callout`              | `default` (no border color), **`primary`**, `secondary`, `tertiary`, `accent-1`, `accent-2` |

What each option does, with the default palette (Storybook shows the same lines in each
component's "Color Option" control):

- `default`: no background
- `primary`: Yale blue background, white text
- `secondary`: medium blue background, white text
- `tertiary`: light blue background, gray-800 text
- `accent-1`: light gray background, gray-800 text
- `accent-2`: dark gray background, white text

Some components use the option to color one part instead of the background. There, the option
colors only that part, for example "`primary`: Yale blue left bar on light gray items":

| Component             | The option colors                                   | `default`             |
| --------------------- | --------------------------------------------------- | --------------------- |
| `ycl-accordion`       | the left bar on light gray items                    | no bar, no background |
| `ycl-image-banner`    | the background behind the image                     |                       |
| `ycl-link-grid`       | the column lines                                    |                       |
| `ycl-pull-quote`      | the quote bar or quote mark                         |                       |
| `ycl-tabs`            | the top border on the selected tab                  |                       |
| `ycl-wrapped-callout` | the callout border                                  | no border color       |

Two components differ in one option: `ycl-facts-and-figures`' `default` has no background and takes
the text color around it, and `ycl-inline-message`'s `accent-1` has Yale blue text.

`ycl-text-copy-button`, `ycl-custom-card` and `ycl-reference-card` have no options but use the
palette too (`secondary` for link hover, `primary`/`secondary` for card accents).

Text colors on each option are fixed (generally white on `primary`, `secondary` and `accent-2`; gray-800 on
`tertiary` and `accent-1`) and, with link, hover and visited link colors, meet WCAG 2.1 AA with the
default palette. Visited links on `secondary` and `tertiary` keep the text color, as the light and
purple visited colors fall short of 4.5:1 there. If you change the
palette, keep each color's contrast with that text at 4.5:1 or more. The Storybook
"Tokens/Theme Builder" story previews a palette on a set of components.

Other design tokens (`--color-blue-yale` and so on) are locked into the component styles at build
time, so redefining them on a page doesn't restyle components; only the `--color-theme-*`
properties and the themeable text, heading, background and link colors do.

## Component tiers

Components live in `src/01-atoms`, `src/02-molecules` and `src/03-organisms`, and the Storybook sidebar uses the same tiers (Atoms, Molecules, Organisms).

These components moved tiers:

- Audio Player: to Molecules
- Action Banner, Image Banner, Content Spotlight Portrait, Content Spotlight Landscape (`text-with-image`) and Tabs: to Organisms
- Link Skip and Read Time: to Atoms

Package import paths such as `yale-ui-cl/tabs` are unchanged, because build entries are named after the element tag. Source paths under `src/` did change, so anything importing from `src/` directly must update the path.

## Using UICL with AI coding tools

[llms.txt](llms.txt) is a short guide for AI coding tools: the available components, naming rules, the tokens-only color rule and example markup. [custom-elements.json](custom-elements.json) is the machine-readable list of every element with its attributes, slots and events; it is generated from the components' JSDoc by `npm run analyze`, which `npm test`, `npm run storybook`, `npm run build` and `npm run build-storybook` run first. Commit the regenerated file with the component change; a stale manifest shows up as a diff after running any of them, CI fails the pull request when the committed file is stale, and `src/manifest.test.js` fails when the JSDoc and the code disagree. Both files ship in the package.

## Migration: one naming pattern and attribute-based options

Every custom element now uses the `ycl-` prefix, and options are set with attributes instead of `class`. The old tag names and class-based options were removed, not deprecated, so existing markup needs updating. Per-component entry names (`yale-ui-cl/cta-link`, `yale-ui-cl/table`, ...) are unchanged.

### Renamed tags

| Old tag | New tag |
|---------|---------|
| `cta-link` | `ycl-cta-link` |
| `text-link` | `ycl-text-link` |
| `text-input` | `ycl-text-input` |
| `select-input` | `ycl-select-input` |
| `yc-table` | `ycl-table` |

### Options moved from `class` to attributes

| Element | Old | New |
|---------|-----|-----|
| `ycl-cta-link`, `ycl-button` | `class="filled radius-pill animate-wipe large"` | `variant="filled" radius="pill" animate="wipe" size="large"` |
| `ycl-list` | `class="tags"` or `class="categories"` | `type="tags"` or `type="categories"` |
| `ycl-text-input`, `ycl-select-input` | `class="required"` | `required` |
| `ycl-text-link` | `class="subtle"` | removed (it had no styles) |

For CTAs, fade is the default animation and needs no attribute; `animate` takes `none`, `rise` or `wipe`.

### Renamed attribute

The `variation` attribute on `ycl-quick-links`, `ycl-page-title` and `ycl-text` is now `variant`, matching `ycl-pull-quote` and `ycl-quote-callout`. For example, `<ycl-page-title variation="event">` becomes `<ycl-page-title variant="event">`.
