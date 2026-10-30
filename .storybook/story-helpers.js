// Shared building blocks for the stories files.

// Serializes an attribute map for a start tag, each attribute with a leading space.
// Unset values (undefined, null, false, '') are left off; true writes a bare attribute.
export const attrs = (map) =>
  Object.entries(map)
    .filter(([, value]) => value !== undefined && value !== null && value !== false && value !== '')
    .map(([name, value]) => (value === true ? ` ${name}` : ` ${name}="${value}"`))
    .join('');

const documented = (category, description, extra) => ({
  description,
  ...extra,
  table: { ...extra.table, category },
});

// argTypes entries for the docs page's Attributes, Slots and Events tables.
export const attributeArg = (description, extra = {}) => documented('Attributes', description, extra);
export const slotArg = (description, extra = {}) => documented('Slots', description, extra);
export const eventArg = (description, extra = {}) => documented('Events', description, { control: false, ...extra });

// The site theme comes from data-global-theme on an ancestor; themed components read their colours from it.
export const globalThemeArgType = {
  name: 'Site Global Theme',
  control: 'select',
  options: ['none', 'one', 'two', 'three', 'four', 'five', 'six'],
  description: 'data-global-theme on an ancestor element, standing in for the site theme; supplies the colours component themes use. "none" leaves the wrapper off.',
  table: { category: 'Page context' },
};

export const withGlobalTheme = (theme, markup) =>
  theme && theme !== 'none' ? `<div data-global-theme="${theme}">${markup}</div>` : markup;

// Inline SVG placeholder image so stories don't depend on an image host. The label defaults to
// the dimensions; pass '' for a plain grey box.
export const placeholder = (width, height, label = `${width} x ${height}`) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="#dddddd"/>${label ? `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="${Math.round(height / 8)}" fill="#4a4a4a">${label}</text>` : ''}</svg>`,
  )}`;
