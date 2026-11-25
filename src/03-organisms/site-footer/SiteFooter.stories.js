import "./SiteFooter";
import "../../02-molecules/link-group/LinkGroup";
import "../../02-molecules/social-links/SocialLinks";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/text-link/Link";
import { attributeArg, attrs, slotArg } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Organisms/Site Footer',
  component: 'ycl-site-footer',
  parameters: { layout: 'fullscreen' },
  argTypes: {
    accessibilityHref: attributeArg('accessibility-href attribute: where "Accessibility at Yale" points. Empty uses Yale\'s accessibility page; the link is always shown.', { name: 'Accessibility link', control: 'text' }),
    privacyHref: attributeArg('privacy-href attribute: where "Privacy Policy" points. Empty uses Yale\'s privacy statement; the link is always shown.', { name: 'Privacy link', control: 'text' }),
    content: slotArg('Default slot: free content beside the wordmark, such as an address. Omitted when empty.', { control: 'text' }),
    links: slotArg('slot="links": footer links, usually a ycl-link-group. Omitted when off.', { name: 'Show links', control: 'boolean' }),
    social: slotArg('slot="social": a ycl-social-links. Omitted when off.', { name: 'Show social links', control: 'boolean' }),
  },
  args: {
    accessibilityHref: '',
    privacyHref: '',
    content: '149 Elm Street, New Haven, CT 06511',
    links: true,
    social: true,
  },

  render: (args) =>
    `<ycl-site-footer${attrs({ 'accessibility-href': args.accessibilityHref, 'privacy-href': args.privacyHref })}>
      ${args.content ? `<p>${args.content}</p>` : ''}
      ${args.links ? `<ycl-link-group slot="links">
        <ycl-heading level="2" slot="heading-one">Resources</ycl-heading>
        <ycl-heading level="2" slot="heading-two">Connect</ycl-heading>
        <ycl-text-link slot="links-one" href="#">Admissions</ycl-text-link>
        <ycl-text-link slot="links-one" href="#">Calendar</ycl-text-link>
        <ycl-text-link slot="links-one" href="#">Directory</ycl-text-link>
        <ycl-text-link slot="links-two" href="#">Contact us</ycl-text-link>
        <ycl-text-link slot="links-two" href="#">Visit</ycl-text-link>
      </ycl-link-group>` : ''}
      ${args.social ? `<ycl-social-links slot="social" facebook="https://www.facebook.com/YaleUniversity" instagram="https://www.instagram.com/yale" youtube="https://www.youtube.com/yale"></ycl-social-links>` : ''}
    </ycl-site-footer>`,
};

export const Default = {};

// Only the guardrails: the wordmark, the accessibility and privacy links and the copyright line.
export const Minimal = {
  args: { content: '', links: false, social: false },
};
