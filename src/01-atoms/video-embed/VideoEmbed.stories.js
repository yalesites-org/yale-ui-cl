import "./VideoEmbed";
export default {
  title: 'Video Embed',
  component: 'ycl-video-embed',
  argTypes: {
    src: { name: 'Embed URL', control: 'text' },
    title: { name: 'Accessible title', control: 'text' },
    ratio: {
      name: 'Aspect ratio',
      type: 'select',
      options: ['16x9', '4x3', '1x1'],
    },
  },
  args: {
    src: 'https://www.youtube-nocookie.com/embed/GL5XhmKCXo0',
    title: 'YouTube video player',
    ratio: '16x9',
  },
  render: (args) =>
    `<ycl-video-embed src="${args.src}" video-title="${args.title}" ratio="${args.ratio}" style="max-width: 50rem;"></ycl-video-embed>`,
};

export const Default = {};

export const SlottedEmbedCode = {
  render: () =>
    `<ycl-video-embed style="max-width: 50rem;">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/GL5XhmKCXo0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </ycl-video-embed>`,
};

export const FourByThree = {
  args: {
    ratio: '4x3',
  },
};
