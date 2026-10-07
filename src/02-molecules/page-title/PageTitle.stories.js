import "./PageTitle";
import "../../01-atoms/text-link/Link";
import "../../01-atoms/date-time/DateTime";
import "../../01-atoms/image/ResponsiveImage";

// Inline placeholder so the story needs no network or image assets.
const placeholder = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 9"><rect width="16" height="9" fill="#dddddd"/></svg>')}`;

export default {
  title: 'Molecules/Page Title',
  component: 'ycl-page-title',
  argTypes: {
    heading: {control: 'text'},
    prefix: {control: 'text'},
    showMeta: {name: 'Meta', control: 'boolean'},
    socialLinks: {name: 'Social Links', control: 'boolean'},
    width: {
      name: 'Width',
      type: 'select',
      options: ['site', 'highlight', 'content', 'max'],
    },
},
  args: {
    heading: 'Davis Team Project Wins Award for Research',
    prefix: '',
    showMeta: true,
    socialLinks: false,
    width: 'site',
},

  render: (args) =>
    `<ycl-page-title width="${args.width}"${args.prefix ? ` prefix="${args.prefix}"` : ''}>
      ${args.heading}
      ${args.showMeta ? `<span slot="meta">By Charlyn Paradis</span>
      <ycl-date-time slot="meta" start="2022-01-25T12:00:00" format="date"></ycl-date-time>` : ''}
      ${args.socialLinks ? `<div slot="social-links" style="display: flex; gap: 1rem;">
        <text-link href="https://www.facebook.com/sharer/sharer.php">Share on Facebook</text-link>
        <text-link href="https://www.linkedin.com/sharing/share-offsite/">Share on LinkedIn</text-link>
      </div>` : ''}
    </ycl-page-title>`,
};

export const Default = {};

export const WithPrefix = {
  args: {
    prefix: 'Feature',
  },
};

export const WithSocialLinks = {
  args: {
    socialLinks: true,
  },
};

export const Event = {
  render: () =>
    `<ycl-page-title variation="event">
      Yale Commencement 2026
      <ycl-image slot="image" ratio="16x9"><img src="${placeholder}" alt="Graduates gathered on Old Campus"></ycl-image>
      <ycl-date-time slot="meta" start="2026-05-18T12:00:00" format="day__long"></ycl-date-time>
      <span slot="meta">Old Campus</span>
    </ycl-page-title>`,
};

export const VisuallyHidden = {
  render: () =>
    `<ycl-page-title display="visually-hidden">About the School</ycl-page-title>
    <p>The page title is still announced by screen readers but isn't shown.</p>`,
};
