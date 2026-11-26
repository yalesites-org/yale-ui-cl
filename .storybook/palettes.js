// The YaleSites color palettes for Storybook's palette switcher (the paint-brush menu in the
// toolbar). Read from the tokens package, which is also where YaleSites site settings get the
// palette names, so the list and labels stay in step with what editors pick from.
import tokens from '@yalesites-org/tokens/build/json/tokens.json';

// The page-level custom properties components take their palette from (see README "Theming"),
// fed by the first five color slots of a YaleSites palette, in order.
export const PALETTE_PROPERTIES = [
  '--color-theme-primary',
  '--color-theme-secondary',
  '--color-theme-tertiary',
  '--color-theme-accent-1',
  '--color-theme-accent-2',
];
const SLOTS = ['slot-one', 'slot-two', 'slot-three', 'slot-four', 'slot-five'];

const slug = (label) =>
  label
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

// In the tokens' order; the first, Old Blues, is the components' own default.
export const PALETTES = Object.values(tokens['global-themes']).map(({ label, colors }) => ({
  id: slug(label),
  label,
  colors: SLOTS.map((slot) => colors[slot]),
}));
export const [DEFAULT_PALETTE] = PALETTES;

// Sets the palette on the document root. Old Blues (or an unknown id) clears the properties
// instead, so components fall back to their built-in defaults and the default render is unchanged.
export function applyPalette(id, root = document.documentElement) {
  const palette = PALETTES.find((p) => p.id === id);
  const colors = palette && palette !== DEFAULT_PALETTE ? palette.colors : null;
  PALETTE_PROPERTIES.forEach((property, i) => {
    if (colors) root.style.setProperty(property, colors[i]);
    else root.style.removeProperty(property);
  });
}

export const paletteGlobalType = {
  description: 'YaleSites color palette',
  toolbar: {
    title: 'Palette',
    icon: 'paintbrush',
    items: PALETTES.map(({ id, label }) => ({ value: id, title: label })),
    dynamicTitle: true,
  },
};

// Re-runs on every render, so picking a palette repaints the current story without a reload.
export const withPalette = (story, { globals }) => {
  applyPalette(globals.palette);
  return story();
};
