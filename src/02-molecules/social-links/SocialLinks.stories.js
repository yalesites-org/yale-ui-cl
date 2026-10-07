import "./SocialLinks";
export default {
  title: 'Molecules/Social Links',
  component: 'ycl-social-links',
  argTypes: {
    xTwitter: {name: 'X (formerly Twitter) URL', control: 'text'},
    facebook: {name: 'Facebook URL', control: 'text'},
    youtube: {name: 'YouTube URL', control: 'text'},
    instagram: {name: 'Instagram URL', control: 'text'},
    weibo: {name: 'Weibo URL', control: 'text'},
    linkedin: {name: 'LinkedIn URL', control: 'text'},
    bluesky: {name: 'Bluesky URL', control: 'text'},
},
  args: {
    xTwitter: 'https://www.twitter.com',
    facebook: 'https://www.facebook.com',
    youtube: 'https://www.youtube.com',
    instagram: 'https://www.instagram.com',
    weibo: 'https://www.weibo.com',
    linkedin: 'https://www.linkedin.com',
    bluesky: 'https://bsky.app/',
},

  render: (args) =>
    `<ycl-social-links
      x-twitter="${args.xTwitter}"
      facebook="${args.facebook}"
      youtube="${args.youtube}"
      instagram="${args.instagram}"
      weibo="${args.weibo}"
      linkedin="${args.linkedin}"
      bluesky="${args.bluesky}"
    ></ycl-social-links>`,
};

export const Default = {};

export const SomePlatforms = {
  args: {
    xTwitter: '',
    weibo: '',
    bluesky: '',
  },
};
