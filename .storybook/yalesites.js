// Docs page for every component: the standard autodocs blocks, plus a line naming the matching
// YaleSites component (recorded on each story file's default export as parameters.yalesites) and
// linking to it in the YaleSites component library (CLT) Storybook. Written with createElement
// so preview.js needs no JSX build step.
import { createElement as h, Fragment } from 'react';
import { Controls, Description, Primary, Stories, Subtitle, Title, useOf } from '@storybook/addon-docs/blocks';

const CLT_STORYBOOK = 'https://yalesites-org.github.io/component-library-twig/';

const cltStoryUrl = (story) => `${CLT_STORYBOOK}?path=/story/${story}`;

const YaleSitesMatch = () => {
  const { preparedMeta } = useOf('meta');
  const yalesites = preparedMeta.parameters?.yalesites;
  if (!yalesites) return null;
  if (yalesites.none) {
    return h('p', null, 'YaleSites match: none. This component is UICL only.');
  }
  return h(
    'p',
    null,
    'YaleSites match: ',
    h('a', { href: cltStoryUrl(yalesites.story), target: '_blank', rel: 'noopener' }, yalesites.name),
  );
};

export const DocsPage = () =>
  h(
    Fragment,
    null,
    h(Title),
    h(Subtitle),
    h(YaleSitesMatch),
    h(Description),
    h(Primary),
    h(Controls),
    h(Stories),
  );
