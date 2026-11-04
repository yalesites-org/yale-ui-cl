# Yale UI Component Library

Yale web components written as plain JavaScript custom elements (no framework) and styled with
plain CSS. Components are documented in Storybook.

**Storybook (latest release):** https://yalesites-org.github.io/yale-ui-cl/

## Development

    nvm use
    npm ci
    npm run storybook

`npm ci` needs a GitHub Packages token for `@yalesites-org` packages in the
`YALESITES_BUILD_TOKEN` environment variable.

| Command | What it does |
| --- | --- |
| `npm run storybook` | Storybook dev server on port 6006 |
| `npm run build-storybook` | Static Storybook build |
| `npm run build` | Library build into `dist/` |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit and Storybook render tests |

## Layout

Components are grouped by atomic tier, one folder per component:

- `src/00-tokens/`: typography CSS
- `src/01-atoms/<name>/`: smallest components
- `src/02-molecules/<name>/`: components composed from atoms
- `src/styles/`: global cascade setup (`base.css`) and utilities

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

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).
