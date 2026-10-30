import "./AudioPlayer";
import { attrs, slotArg, attributeArg } from "../../../.storybook/story-helpers.js";

const sampleUrl = "https://dn790001.ca.archive.org/0/items/78_get-your-kicks-on-route-66_wingy-manones-orch-wingy-manone-nick-fatool-stanley-wr_gbia0104413a/Get%20Your%20Kicks%20on%20Route%2066%20-%20Wingy%20Manone%27s%20Orch..mp3";

export default {
  title: 'Atoms/Audio Player',
  component: 'ycl-audio',
  argTypes: {
    url: attributeArg('src: URL of the audio file to play. Omitted when empty.', { name: 'Audio URL', control: 'text' }),
    content: slotArg('Optional text shown above the player (default slot). Omitted when empty.', { name: 'Content', control: 'text' }),
    audio: slotArg('slot="audio": your own `<audio>` element (e.g. with several `<source>`s) in place of src.', { control: false }),
  },
  args: {
    content: 'Get Your Kicks on Route 66',
    url: sampleUrl,
  },
  render: (args) =>
    `<ycl-audio${attrs({ src: args.url })}>${args.content ? `<p>${args.content}</p>` : ''}</ycl-audio>`,
};

export const Default = {};

export const SlottedAudioElement = {
  parameters: {
    docs: {
      description: {
        story: 'Supplies an `<audio slot="audio">` with its own `<source>` children instead of the src attribute. That is different child markup, which a control cannot switch on.',
      },
    },
  },
  render: (args) =>
    `<ycl-audio>${args.content ? `
      <p>${args.content}</p>` : ''}
      <audio slot="audio" preload="metadata">${args.url ? `
        <source src="${args.url}" type="audio/mpeg">` : ''}
      </audio>
    </ycl-audio>`,
};
