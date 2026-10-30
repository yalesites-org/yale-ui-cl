import "./Embed";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

export default {
  title: 'Molecules/Embed',
  component: 'ycl-embed',
  argTypes: {
    src: attributeArg('URL loaded in the iframe. Without it, the default slot renders instead.', { control: 'text' }),
    label: attributeArg('Accessible title of the iframe.', { control: 'text' }),
    type: attributeArg('Kind of embed, which sets the iframe height and aspect ratio.', {
      name: 'Type',
      control: 'select',
      options: ['form', 'audio', 'map', 'calendar', 'video', 'unknown'],
    }),
    width: attributeArg('Width of the embed. Defaults to site.', {
      name: 'Width',
      control: 'select',
      options: ['max', 'site', 'highlight', 'content'],
    }),
    loading: attributeArg('Iframe loading. Defaults to lazy.', {
      name: 'Loading',
      control: 'select',
      options: ['lazy', 'eager'],
    }),
    allowfullscreen: attributeArg('Lets the iframe go full screen.', { control: 'boolean' }),
    content: slotArg('Script-driven embed markup (default slot), shown when there is no src. See the Script Embed story.', {
      control: false,
    }),
  },
  args: {
    src: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/320687463',
    label: 'Example SoundCloud Track',
    type: 'audio',
    width: 'site',
    loading: 'lazy',
    allowfullscreen: false,
  },

  render: (args) =>
    `<ycl-embed${attrs({
      src: args.src,
      label: args.label,
      width: args.width,
      type: args.type,
      loading: args.loading,
      allowfullscreen: args.allowfullscreen,
    })}></ycl-embed>`,
};

export const Default = {};

export const ScriptEmbed = {
  parameters: {
    docs: {
      description: {
        story: 'Script-driven embeds (X, Instagram, Bluesky) put a blockquote and script in the default slot instead of using src. Controls only set attributes, so they cannot build this slotted markup.',
      },
    },
  },
  render: (args) =>
    `<ycl-embed${attrs({ width: args.width })}>
      <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Yale scientists find a common weed harbors important clues about how to create drought resistant crops in a world beset by climate change. <a href="https://twitter.com/yale_eeb">@yale_eeb</a></p>&mdash; Yale University (@Yale) <a href="https://twitter.com/Yale/status/1586724355089776640">October 30, 2022</a></blockquote>
      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    </ycl-embed>`,
};
