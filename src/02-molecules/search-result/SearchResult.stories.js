import "./SearchResult";
import "../../01-atoms/text-link/Link";

const breadcrumbs = ['Home', 'Academic Programs', 'Undergraduate Chemistry'];

export default {
  title: 'Molecules/Search Result',
  component: 'ycl-search-result',
  argTypes: {
    heading: {control: 'text'},
    url: {name: 'URL', control: 'text'},
    highlighted: {name: 'Search Results Highlighted', control: 'text'},
    teaser: {name: 'Search Results Teaser', control: 'text'},
    contentType: {name: 'Search Results Content Type', control: 'text'},
    isCas: {name: 'Is CAS', control: 'boolean'},
},
  args: {
    heading: 'Page title',
    url: '#',
    highlighted: '...showing <strong>word</strong> in page result...',
    teaser: 'Meta text here if available. Lorem ipsum dolor amet four loko distillery typewriter twee prism. Umami pinterest knausgaard four dollar toast occupy.',
    contentType: 'post',
    isCas: false,
},

  // Breadcrumbs are slotted, so any breadcrumb markup can be dropped in; this is a minimal stand-in.
  render: (args) =>
    `<ycl-search-result href="${args.url}" content-type="${args.contentType}"${args.isCas ? ' cas' : ''}>
      <h2 slot="heading">${args.heading}</h2>
      <nav slot="breadcrumbs" aria-label="Breadcrumb">
        <ol style="display: flex; flex-wrap: wrap; gap: 0.5rem; list-style: none; margin: 0; padding: 0;">
          ${breadcrumbs.map((crumb, i) => `<li>${i ? '/ ' : ''}<text-link href="#" style="--color-link-base: currentColor; --color-link-visited-base: currentColor;">${crumb}</text-link></li>`).join('')}
        </ol>
      </nav>
      ${args.highlighted ? `<p slot="highlighted">${args.highlighted}</p>` : ''}
      ${args.teaser ? `<p slot="teaser">${args.teaser}</p>` : ''}
    </ycl-search-result>`,
};

export const Default = {};

export const Cas = {
  args: {
    heading: 'Faculty Handbook',
    contentType: 'page',
    isCas: true,
  },
};

export const ResultList = {
  render: () =>
    `<ycl-search-result href="#" content-type="page">
      <h2 slot="heading">Undergraduate Chemistry</h2>
      <p slot="teaser">An introduction to the chemistry major, including course requirements and research opportunities.</p>
    </ycl-search-result>
    <ycl-search-result href="#" content-type="event">
      <h2 slot="heading">Chemistry Department Open House</h2>
      <p slot="highlighted">...meet faculty from the <strong>chemistry</strong> department...</p>
    </ycl-search-result>`,
};
