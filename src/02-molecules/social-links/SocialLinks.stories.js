import "./SocialLinks";
import { attrs, attributeArg } from "../../../.storybook/story-helpers.js";

const platforms = [
  ['xTwitter', 'x-twitter', 'X (formerly Twitter) URL', 'https://www.twitter.com'],
  ['facebook', 'facebook', 'Facebook URL', 'https://www.facebook.com'],
  ['youtube', 'youtube', 'YouTube URL', 'https://www.youtube.com'],
  ['instagram', 'instagram', 'Instagram URL', 'https://www.instagram.com'],
  ['weibo', 'weibo', 'Weibo URL', 'https://www.weibo.com'],
  ['linkedin', 'linkedin', 'LinkedIn URL', 'https://www.linkedin.com'],
  ['bluesky', 'bluesky', 'Bluesky URL', 'https://bsky.app/'],
];

export default {
  title: 'Molecules/Social Links',
  component: 'ycl-social-links',
  argTypes: Object.fromEntries(platforms.map(([key, attribute, name]) => [
    key,
    attributeArg(`${attribute} attribute: profile URL. Clear it to hide the platform.`, { name, control: 'text' }),
  ])),
  args: Object.fromEntries(platforms.map(([key, , , url]) => [key, url])),

  render: (args) =>
    `<ycl-social-links${attrs(Object.fromEntries(platforms.map(([key, attribute]) => [attribute, args[key]])))}></ycl-social-links>`,
};

export const Default = {};
