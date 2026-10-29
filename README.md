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
