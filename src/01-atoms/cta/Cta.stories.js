import "./Cta";
import "../button/Button";
import { optionAttributes, optionArgTypes } from "./cta-story-options.js";

export default {
  title: 'Atoms/CTA',
  component: 'ycl-cta-link',
  argTypes: {
    label: {control: 'text'},
    URL: {control: 'text'},
    ...optionArgTypes,
  },
  args: {
    label: 'Yale HomePage',
    URL: 'https://www.yale.edu',
    variant: 'filled',
    outlineWeight: '2',
    animate: 'fade',
    radius: 'none',
  },

  render: (args) =>
    `<ycl-cta-link ${optionAttributes(args)} href="${args.URL}">${args.label}</ycl-cta-link>`,
};

export const Filled = {
  args: {
    variant: 'filled',
  },
};

export const Outline = {
  args: {
    variant: 'outline',
  },
};

export const OutlinePill = {
  args: {
    variant: 'outline',
    radius: 'pill',
  },
};

const group = (heading, items) => `
  <h2 style="margin-block: var(--size-spacing-6) var(--size-spacing-3);">${heading}</h2>
  <div style="display: flex; flex-wrap: wrap; gap: var(--size-spacing-4); align-items: center;">
    ${items.join('\n    ')}
  </div>`;

// Every CTA option side by side, like the YaleSites component library's CTA page. No variant
// renders filled.
export const AllVariants = {
  parameters: {controls: {disable: true}},
  render: () => [
    group('Filled', [
      '<ycl-cta-link href="#">Radius none</ycl-cta-link>',
      '<ycl-cta-link href="#" radius="soft">Radius soft</ycl-cta-link>',
      '<ycl-cta-link href="#" radius="pill">Radius pill</ycl-cta-link>',
      '<ycl-cta-link href="https://www.yale.edu">External link</ycl-cta-link>',
      '<ycl-cta-link href="https://www.yale.edu/example.pdf">Download</ycl-cta-link>',
      '<ycl-button control-type="dropdown" expanded="false">Dropdown</ycl-button>',
    ]),
    group('Outline', [
      '<ycl-cta-link variant="outline" href="#">Radius none</ycl-cta-link>',
      '<ycl-cta-link variant="outline" href="#" radius="soft">Radius soft</ycl-cta-link>',
      '<ycl-cta-link variant="outline" href="#" radius="pill">Radius pill</ycl-cta-link>',
      '<ycl-cta-link variant="outline" href="https://www.yale.edu">External link</ycl-cta-link>',
      '<ycl-cta-link variant="outline" href="https://www.yale.edu/example.pdf">Download</ycl-cta-link>',
      '<ycl-button variant="outline" control-type="dropdown" expanded="false">Dropdown</ycl-button>',
    ]),
    group('Outline Weights', [
      '<ycl-cta-link variant="outline" outline-weight="1" href="#">Weight 1</ycl-cta-link>',
      '<ycl-cta-link variant="outline" href="#">Weight 2 (default)</ycl-cta-link>',
      '<ycl-cta-link variant="outline" outline-weight="4" href="#">Weight 4</ycl-cta-link>',
    ]),
    group('Hover Effects', [
      '<ycl-cta-link href="#" animate="none">Filled none</ycl-cta-link>',
      '<ycl-cta-link href="#">Filled fade</ycl-cta-link>',
      '<ycl-cta-link href="#" animate="rise">Filled rise</ycl-cta-link>',
      '<ycl-cta-link href="#" animate="wipe">Filled wipe</ycl-cta-link>',
      '<ycl-cta-link variant="outline" href="#" animate="none">Outline none</ycl-cta-link>',
      '<ycl-cta-link variant="outline" href="#">Outline fade</ycl-cta-link>',
      '<ycl-cta-link variant="outline" href="#" animate="rise">Outline rise</ycl-cta-link>',
      '<ycl-cta-link variant="outline" href="#" animate="wipe">Outline wipe</ycl-cta-link>',
    ]),
  ].join('\n'),
};
