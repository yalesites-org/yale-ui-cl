# Basic Style Dictionary

This example code is bare-bones to show you what this framework can do. If you have the style-dictionary module installed globally, you can `cd` into this directory and run:

```bash
npx style-dictionary build
```

Otherwise, install Style Dictionary locally for this project first, `cd` into this directory and run:

```bash
npm init -y && npm install style-dictionary
```

and then run the above command.

## Component tiers

Components live in `src/01-atoms`, `src/02-molecules` and `src/03-organisms`, and the Storybook sidebar uses the same tiers (Atoms, Molecules, Organisms).

These components moved tiers:

- Audio Player: to Molecules
- Action Banner, Image Banner, Content Spotlight Portrait, Content Spotlight Landscape (`text-with-image`) and Tabs: to Organisms
- Link Skip and Read Time: to Atoms

Package import paths such as `yale-ui-cl/tabs` are unchanged, because build entries are named after the element tag. Source paths under `src/` did change, so anything importing from `src/` directly must update the path.

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
