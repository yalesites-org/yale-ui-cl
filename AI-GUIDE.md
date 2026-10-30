# UICL guide for AI coding tools

UICL (yale-ui-cl) is the Yale UI component library: vanilla custom elements with closed shadow roots and Yale design tokens. You write plain HTML with these tags; there is no framework.

## Source of truth

`custom-elements.json` in the package root lists every element with its attributes (with allowed values), slots, events, CSS parts and CSS custom properties. It is generated from the component code. When this guide and the manifest disagree, the manifest wins. Do not use an attribute, slot or event that is not in it.

## Loading the library

The package is not published to a registry yet. Once installed, load it in one of two ways.

Whole library, from the build output:

```html
<link rel="stylesheet" href="node_modules/yale-ui-cl/dist/yale-ui-cl.css">
<script type="module" src="node_modules/yale-ui-cl/dist/yale-ui-cl.js"></script>
```

Or per component, with a bundler. Each import registers the tags in that file, and nothing else, so import every component your markup uses:

```js
import "yale-ui-cl/style.css";   // tokens, reset and typography: always load it
import "yale-ui-cl/callout";     // ycl-callout and ycl-callout-item
import "yale-ui-cl/heading";     // ycl-heading
import "yale-ui-cl/cta-link";    // cta-link
```

The import path is the tag without its `ycl-` or `yc-` prefix (`ycl-accordion` is `yale-ui-cl/accordion`, `yc-table` is `yale-ui-cl/table`). Child elements come with their parent.

## Components

| Tag | Purpose |
| --- | --- |
| `cta-link` | Call-to-action link styled as a button |
| `text-link` | Inline text link |
| `ycl-button` | Button, or a link styled as one when given `href` |
| `ycl-text-copy-button` | Copies text to the clipboard |
| `ycl-heading` | Heading h1 to h6, with optional prefix and link |
| `ycl-icon` | Icon from the library's icon set |
| `ycl-image` | Image with aspect ratio and caption |
| `ycl-divider` | Horizontal rule |
| `ycl-date-time` | Formatted date, time or date range |
| `ycl-list` | Taxonomy list (categories, tags) around a `<ul>` or `<ol>` |
| `yc-table` | Styled, scrollable wrapper for a `<table>` |
| `ycl-audio` | Audio player |
| `ycl-video-embed` | Responsive video iframe |
| `text-input` | Text field with label, instructions and errors |
| `select-input` | Select field with label, instructions and errors |
| `ycl-checkbox` | Checkbox |
| `ycl-radio` | Radio button; same `name` makes a group |
| `ycl-accordion` | Collapsible sections; contains `ycl-accordion-item` |
| `ycl-accordion-item` | One accordion section |
| `ycl-alert` | Site-wide alert banner |
| `ycl-inline-message` | Short highlighted message |
| `ycl-callout` | Band of highlighted callouts; contains `ycl-callout-item` |
| `ycl-callout-item` | One callout |
| `ycl-wrapped-callout` | Callout box with body text wrapping around it |
| `ycl-quote-callout` | Large quote with attribution |
| `ycl-pull-quote` | Quote set off from the text |
| `ycl-action-banner` | Banner with image, text and actions |
| `ycl-image-banner` | Large image banner |
| `ycl-page-title` | The page's h1 title area |
| `ycl-text` | Block of rich text |
| `ycl-image-block` | Content image with caption |
| `ycl-wrapped-image` | Image with body text wrapping around it |
| `ycl-text-with-image` | Text beside an image |
| `ycl-content-spotlight-portrait` | Text beside a portrait image |
| `ycl-video` | Video with heading and text |
| `ycl-embed` | Embedded form, map, calendar, audio or video |
| `ycl-custom-card` | Card with heading, text, image |
| `ycl-reference-card` | Card for a post, event, profile or resource |
| `ycl-directory-listing-card` | Person card with contact details |
| `ycl-tile-item` | Colored tile |
| `ycl-facts-and-figures` | Statistic with supporting text |
| `ycl-link-group` | One or two columns of links |
| `ycl-link-grid` | Up to four columns of links |
| `ycl-quick-links` | Heading, description and a list of links |
| `ycl-link-skip` | "Skip to main content" link |
| `ycl-social-links` | Social media icon links |
| `ycl-tabs` | Tabbed panels; contains `ycl-tab` |
| `ycl-tab` | One tab and its panel |
| `ycl-taxonomy-display` | Groups of taxonomy terms; contains `ycl-taxonomy-display-item` |
| `ycl-taxonomy-display-item` | One labelled group of terms |
| `ycl-related-content` | List of related links; contains `ycl-related-content-item` |
| `ycl-related-content-item` | One related link |
| `ycl-search-result` | One search result |
| `ycl-read-time` | Estimated reading time |
| `ycl-pager` | Page-number navigation |
| `ycl-modal` | Modal dialog |
| `ycl-data-table` | Search and sorting for a `<table>` |

## Naming rules

- Use tag names exactly as listed. Most start with `ycl-`; the exceptions are `cta-link`, `text-link`, `text-input`, `select-input` and `yc-table`. Do not invent tags or add or remove prefixes.
- Attributes are kebab-case (`overlay-image`, `button-alignment`). Use only the values the manifest lists. Boolean attributes are on when present (`<ycl-accordion-item expanded>`).
- Put content into a named slot with `slot="name"` on a direct child: `<ycl-heading slot="heading">`. Children with no `slot` attribute go into the default slot.
- Child elements go directly inside their parent: `ycl-accordion-item` in `ycl-accordion`, `ycl-callout-item` in `ycl-callout`, `ycl-tab` in `ycl-tabs`, `ycl-taxonomy-display-item` in `ycl-taxonomy-display`, `ycl-related-content-item` in `ycl-related-content`.
- Use `ycl-heading` for headings inside components, with the right `level` for the page outline.
- `cta-link` and `ycl-button` take style variants in `class` (for example `class="filled radius-pill"`), as listed in the manifest. `text-link` has none.

## Colors: tokens only

Never hard-code a color (no hex, `rgb()`, `hsl()` or named colors) in markup or CSS for these components.

1. Prefer the component's own attributes: `theme="one"` to `"six"` (and `"default"` where listed), plus `data-global-theme="one"` to `"six"` on an ancestor such as `<body>` for the site-wide palette.
2. For your own page CSS, use the `@yalesites-org/tokens` custom properties, such as `var(--color-blue-yale)` or `var(--color-gray-100)`. `yale-ui-cl.css` defines them on `:root`.
3. Pages may only restyle components through these custom properties: `--color-text`, `--color-heading`, `--color-background`, `--color-link-base`, `--color-link-hover`, `--color-link-visited-base`, `--color-link-visited-hover`, plus any component custom properties listed in the manifest (such as `--color-divider` on `ycl-divider`). Set them to tokens. Every other token is baked into the components at build time, so redefining it has no effect.

## Examples

A callout with a button:

```html
<ycl-callout theme="two" alignment="center">
  <ycl-callout-item>
    <ycl-heading level="2" slot="heading">Degree Programs</ycl-heading>
    <p>Programs for students who plan to go on to graduate study or a career in science.</p>
    <cta-link slot="link" class="outline" href="https://www.yale.edu">Programs</cta-link>
  </ycl-callout-item>
</ycl-callout>
```

An accordion:

```html
<ycl-accordion theme="default">
  <ycl-heading level="2" slot="heading">Frequently asked questions</ycl-heading>
  <ycl-accordion-item expanded>
    <ycl-heading level="3" slot="heading">When does the term start?</ycl-heading>
    <p>Classes begin in late August.</p>
  </ycl-accordion-item>
  <ycl-accordion-item>
    <ycl-heading level="3" slot="heading">How do I apply?</ycl-heading>
    <p>Apply online through the admissions office.</p>
  </ycl-accordion-item>
</ycl-accordion>
```

Text beside an image, with two links:

```html
<ycl-text-with-image theme="one" position="image-right">
  <ycl-heading level="2" slot="heading">Visit campus</ycl-heading>
  <p>Tours run every weekday.</p>
  <cta-link slot="ctas" class="filled" href="/visit">Plan a visit</cta-link>
  <text-link slot="ctas" href="/maps">Campus maps</text-link>
  <ycl-image slot="image"><img src="campus.jpg" alt="Students walking across Old Campus"></ycl-image>
</ycl-text-with-image>
```
