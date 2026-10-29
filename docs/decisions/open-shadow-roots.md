# Open shadow roots

## Context

Every UICL component attached a closed shadow root. A closed root is invisible from outside the
component: `element.shadowRoot` is `null`, so axe (run on every story through Storybook's a11y
addon), browser devtools tooling and code tools could not see a component's internals. The story
a11y checks reported zero violations across all stories, but only because axe was checking the
light DOM around each component, not the markup users actually get. That was a blind spot, not a
clean bill of health.

## Decision

All components attach open shadow roots (`attachShadow({ mode: "open" })`). Nothing else about how
they attach their roots changes (`delegatesFocus` stays where it was).

## Why

- Testability: axe and unit tests can reach a component's internals. `src/a11y.test.js` plants a
  violation inside a component's shadow root and checks that axe reports it.
- Inspectability: developers, devtools and other tools can see what a component renders.
- Closed roots gave no real encapsulation or security benefit. Shadow DOM still scopes styles,
  private class fields (`#shadow` and the rest) still keep component state private, and a closed
  root never stopped script on the page from changing what users see.

## Consequences

The story a11y checks now cover component internals. Turning them on found four problems, all
fixed:

- Site Alert: announcement and marketing alerts both named their landmark "Announcement", so a page
  with both had two landmarks with the same name. Each type now has its own default name, and a
  `label` attribute lets authors name the landmark when a page has more than one alert of a type.
- Taxonomy Display: items took the `listitem` role only through ElementInternals, which axe does not
  read, so the list looked empty of list items. Items now also set `role="listitem"` on the host
  when the author has not set a role.
- Content Spotlight Landscape (`ycl-text-with-image`): the overline stayed gray-500 on themed
  backgrounds, failing text contrast on theme one's dark blue. On a themed background it now uses
  the theme's text colour, as the caption already did.
- Tabs: the first panel faded in from opacity 0 on first render, so axe measured near-invisible
  text (contrast 1.06). Panels now fade in only when the selection changes, and the panel a page
  loads with shows at full strength.

## Open follow-up

Open roots do not change how authors style component internals. Whether to expose `::part` styling
hooks for common pieces (only Heading's `part="prefix"` exists today) is not decided here; it is a
design call for @ntay90 and @miketullo95.
