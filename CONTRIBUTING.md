# Contributing

## Branches

- `develop` is where work lands. Branch from it and open PRs into it.
- `main` is the released branch. Only maintainers merge `develop` into `main`, with a merge
  commit (never a squash). `release-please` then opens a release PR.

## Commits and PR titles

Use Conventional Commits, for example `feat(button): add loading state` or
`fix(alert): announce dismissal`. PRs into `develop` are squash-merged, so the PR title is what
counts. CI checks it.

## Setup

    nvm use
    npm ci
    npm run storybook

`npm ci` needs a GitHub Packages token for `@yalesites-org` packages in the
`YALESITES_BUILD_TOKEN` environment variable. Never write the token into `.npmrc`.

## Before you open a PR

    npm run lint
    npm test
    npm run build

## Adding a component

1. Create a folder under `src/01-atoms/` or `src/02-molecules/`, with `Name.js`, `name.css`,
   and `Name.stories.js`.
2. Add `@import "<path>" layer(components.<name>);` to `src/styles/base.css`.
3. Use token custom properties (such as `--color-blue-yale`), not hardcoded values.
4. Add a story and a test.
