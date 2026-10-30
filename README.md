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

## Using UICL with AI coding tools

[AI-GUIDE.md](AI-GUIDE.md) is a short guide for AI coding tools: the available components, naming rules, the tokens-only color rule and example markup. [custom-elements.json](custom-elements.json) is the machine-readable list of every element with its attributes, slots and events; it is generated from the components' JSDoc by `npm run analyze`, which `npm test`, `npm run storybook`, `npm run build` and `npm run build-storybook` run first. Commit the regenerated file with the component change; a stale manifest shows up as a diff after running any of them, and `src/manifest.test.js` fails when the JSDoc and the code disagree. Both files ship in the package.
