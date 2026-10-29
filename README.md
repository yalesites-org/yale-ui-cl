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

Components share one colour theme. A page sets its palette with five custom properties on any
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

Each themed component picks a palette colour with its `theme` attribute, named after the palette
colour it takes its background (or accent) from. Without the attribute a component uses its
default option, so the attribute is only needed for the others:

```html
<ycl-callout theme="secondary">…</ycl-callout>
```

| Component                          | Options (default first)                                                |
| ---------------------------------- | ---------------------------------------------------------------------- |
| `ycl-accordion`                    | `default` (no accent), `primary`, `secondary`, `tertiary`, `accent-1`, `accent-2` |
| `ycl-action-banner`                | `primary`, `accent-1`, `accent-2`, `tertiary`, `secondary`             |
| `ycl-callout`                      | `primary`, `accent-1`, `accent-2`, `tertiary`, `secondary`             |
| `ycl-content-spotlight-portrait`   | `default` (no background), `primary`, `accent-1`, `accent-2`, `tertiary`, `secondary` |
| `ycl-facts-and-figures`            | `primary`, `secondary`, `tertiary`, `accent-1`, `accent-2`, `default` (no background) |
| `ycl-image-banner`                 | `primary`, `accent-1`, `accent-2`, `tertiary`, `secondary`             |
| `ycl-inline-message`               | `accent-1`, `primary`, `secondary`, `tertiary`, `accent-2`             |
| `ycl-link-grid`                    | `primary`, `tertiary`, `accent-2`, `accent-1`, `secondary`             |
| `ycl-pull-quote`                   | `primary`, `tertiary`, `accent-2`                                      |
| `ycl-quick-links`                  | `primary`, `accent-1`, `accent-2`                                      |
| `ycl-quote-callout`                | `primary`, `tertiary`, `accent-2`, `accent-1`, `secondary`             |
| `ycl-tabs`                         | `primary`, `secondary`, `accent-2`                                     |
| `ycl-taxonomy-display`             | `default` (light gray), `primary`, `accent-1`, `accent-2`, `tertiary`, `secondary` |
| `ycl-text-with-image`              | `default` (no background), `primary`, `accent-1`, `accent-2`, `tertiary`, `secondary` |
| `ycl-tile-item`                    | `primary`, `secondary`, `tertiary`, `accent-1`, `accent-2`             |
| `ycl-wrapped-callout`              | `primary`, `default` (no border colour), `secondary`, `tertiary`, `accent-1`, `accent-2` |

`ycl-text-copy-button`, `ycl-custom-card` and `ycl-reference-card` have no options but use the
palette too (`secondary` for link hover, `primary`/`secondary` for card accents).

Text colours on each option are fixed (generally white on `primary`, `secondary` and `accent-2`; gray-800 on
`tertiary` and `accent-1`) and, with link, hover and visited link colours, meet WCAG 2.1 AA with the
default palette. Visited links on `secondary` and `tertiary` keep the text colour, as the light and
purple visited colours fall short of 4.5:1 there. If you change the
palette, keep each colour's contrast with that text at 4.5:1 or more. The Storybook
"Tokens/Theme Builder" story previews a palette on a set of components.

Other design tokens (`--color-blue-yale` and so on) are locked into the component styles at build
time, so redefining them on a page doesn't restyle components; only the `--color-theme-*`
properties and the themeable text, heading, background and link colours do.
