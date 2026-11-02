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
