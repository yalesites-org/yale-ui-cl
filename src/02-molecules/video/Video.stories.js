import "./Video";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/video-embed/VideoEmbed";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";
export default {
  title: 'Molecules/Video',
  component: 'ycl-video',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    alignment: attributeArg('center puts the heading and text under the video instead of beside it.', {
      name: 'Video Placement',
      control: 'select',
      options: ['left', 'center'],
      mapping: { left: undefined },
    }),
    width: attributeArg('Maximum width of the block.', {
      name: 'Width',
      control: 'select',
      options: ['max', 'site', 'highlight', 'content'],
    }),
    video: slotArg('The video, usually a ycl-video-embed (default slot).', { control: false }),
    heading: slotArg('Video title (slot="heading"). Omitted when empty.', { control: 'text' }),
    text: slotArg('Caption text (slot="text"). Omitted when empty.', { control: 'text' }),
  },
  args: {
    heading: 'This Is Where A Video Title Will Go',
    text: 'This is where captions for videos will go.',
    alignment: 'left',
    width: 'site',
  },

  render: (args) =>
    `<ycl-video${attrs({ alignment: args.alignment, width: args.width })}>
      <ycl-video-embed src="https://www.youtube-nocookie.com/embed/GL5XhmKCXo0" video-title="YouTube video player"></ycl-video-embed>
      ${args.heading ? `<ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : ''}
      ${args.text ? `<p slot="text">${args.text}</p>` : ''}
    </ycl-video>`,
};

export const Default = {};
