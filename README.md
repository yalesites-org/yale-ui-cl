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

## Contributing and security

See [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).
