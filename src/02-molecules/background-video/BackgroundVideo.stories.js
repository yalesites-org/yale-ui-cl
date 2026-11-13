import "./BackgroundVideo";
import "../../01-atoms/headings/Heading";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";
// Inline poster so the story doesn't depend on an image host (the MDN poster URL 404s).
const poster = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><rect width="100%" height="100%" fill="#1b3a5c"/></svg>')}`;

export default {
  title: 'Molecules/Background Video',
  component: 'ycl-background-video',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    src: attributeArg('URL of the video file. It plays muted and looped, with no native controls.', {
      name: 'Video URL',
      control: 'text',
    }),
    poster: attributeArg('Image shown before the video loads, while it is paused, and instead of playback when the visitor prefers reduced motion.', {
      name: 'Poster Image',
      control: 'text',
    }),
    content: slotArg('Content placed over the video (default slot). Omitted when empty.', { control: 'text' }),
  },
  args: {
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm',
    poster,
    content: 'Content over the video',
  },

  render: (args) =>
    `<ycl-background-video${attrs({ src: args.src, poster: args.poster })} style="min-height: 24rem; color: white;">
      ${args.content ? `<ycl-heading level="2" style="color: inherit; padding: 2rem;">${args.content}</ycl-heading>` : ''}
    </ycl-background-video>`,
};

export const Default = {};
