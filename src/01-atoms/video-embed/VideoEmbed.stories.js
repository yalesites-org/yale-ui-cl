import "./VideoEmbed";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Atoms/Video Embed',
  component: 'ycl-video-embed',
  argTypes: {
    src: attributeArg('src: embed URL; the component builds the iframe. A slotted embed wins over src.', {
      name: 'Embed URL',
      control: 'text',
    }),
    title: attributeArg('video-title: title of the built iframe. Defaults to "Embedded video".', {
      name: 'Accessible title',
      control: 'text',
    }),
    ratio: attributeArg('ratio: aspect ratio of the player (16x9 by default).', {
      name: 'Aspect ratio',
      control: 'select',
      options: ['16x9', '4x3', '1x1'],
      mapping: { '16x9': undefined },
    }),
    embed: slotArg('Default slot: a provider\'s embed code (`<iframe>`, `<video>`, ...) used instead of src.', { control: false }),
  },
  args: {
    src: 'https://www.youtube-nocookie.com/embed/GL5XhmKCXo0',
    title: 'YouTube video player',
    ratio: '16x9',
  },
  render: (args) =>
    `<ycl-video-embed${attrs({ src: args.src, 'video-title': args.title, ratio: args.ratio })} style="max-width: 50rem;"></ycl-video-embed>`,
};

export const Default = {};

export const SlottedEmbedCode = {
  parameters: {
    docs: {
      description: {
        story: 'Slots a provider\'s own `<iframe>` embed code instead of using src. That is different child markup, which a control cannot switch on.',
      },
    },
  },
  render: () =>
    `<ycl-video-embed style="max-width: 50rem;">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/GL5XhmKCXo0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </ycl-video-embed>`,
};
