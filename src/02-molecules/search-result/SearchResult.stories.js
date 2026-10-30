import "./SearchResult";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/text-link/Link";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

const breadcrumbs = ['Home', 'Academic Programs', 'Undergraduate Chemistry'];

export default {
  title: 'Molecules/Search Result',
  component: 'ycl-search-result',
  argTypes: {
    url: attributeArg('URL the heading links to.', { name: 'href', control: 'text' }),
    contentType: attributeArg('Content type shown with the result (e.g. post, page, event).', { name: 'content-type', control: 'text' }),
    isCas: attributeArg('Marks a result that needs a CAS (Yale NetID) login.', { name: 'cas', control: 'boolean' }),
    heading: slotArg('Result title (slot="heading").', { control: 'text' }),
    breadcrumbs: slotArg('Story-only toggle for the breadcrumbs slot (slot="breadcrumbs"), which takes any breadcrumb markup.', { control: 'boolean' }),
    highlighted: slotArg('Matched text excerpt (slot="highlighted"). Omitted when empty.', { control: 'text' }),
    teaser: slotArg('Summary text (slot="teaser"). Omitted when empty.', { control: 'text' }),
  },
  args: {
    heading: 'Page title',
    url: '#',
    highlighted: '...showing <strong>word</strong> in page result...',
    teaser: 'Meta text here if available. Lorem ipsum dolor amet four loko distillery typewriter twee prism. Umami pinterest knausgaard four dollar toast occupy.',
    contentType: 'post',
    isCas: false,
    breadcrumbs: true,
  },

  // Breadcrumbs are slotted, so any breadcrumb markup can be dropped in; this is a minimal stand-in.
  render: (args) =>
    `<ycl-search-result${attrs({ href: args.url, 'content-type': args.contentType, cas: args.isCas })}>
      <ycl-heading level="2" slot="heading">${args.heading ?? ''}</ycl-heading>
      ${args.breadcrumbs ? `<nav slot="breadcrumbs" aria-label="Breadcrumb">
        <ol style="display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; margin: 0; padding: 0;">
          ${breadcrumbs.map((crumb, i) => `<li>${i ? '/ ' : ''}<text-link href="#" style="--color-link-base: currentColor; --color-link-visited-base: currentColor;">${crumb}</text-link></li>`).join('')}
        </ol>
      </nav>` : ''}
      ${args.highlighted ? `<p slot="highlighted">${args.highlighted}</p>` : ''}
      ${args.teaser ? `<p slot="teaser">${args.teaser}</p>` : ''}
    </ycl-search-result>`,
};

export const Default = {};

export const ResultList = {
  parameters: {
    docs: {
      description: {
        story: 'Several results stacked as on a results page, each with different slots filled. Controls drive a single result, so they cannot build a list.',
      },
    },
  },
  render: () =>
    `<ycl-search-result href="#" content-type="page">
      <ycl-heading level="2" slot="heading">Undergraduate Chemistry</ycl-heading>
      <p slot="teaser">An introduction to the chemistry major, including course requirements and research opportunities.</p>
    </ycl-search-result>
    <ycl-search-result href="#" content-type="event">
      <ycl-heading level="2" slot="heading">Chemistry Department Open House</ycl-heading>
      <p slot="highlighted">...meet faculty from the <strong>chemistry</strong> department...</p>
    </ycl-search-result>`,
};
