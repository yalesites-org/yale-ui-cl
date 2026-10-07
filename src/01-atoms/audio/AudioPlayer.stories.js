import "./AudioPlayer";
export default {
  title: 'Atoms/Audio Player',
  component: 'ycl-audio',
  argTypes: {
    content: {
      name: 'Content',
      description: 'Optional text shown above the player',
      control: 'text',
    },
    url: { name: 'Audio URL', control: 'text' },
  },
  args: {
    content: 'Get Your Kicks on Route 66',
    url: "https://dn790001.ca.archive.org/0/items/78_get-your-kicks-on-route-66_wingy-manones-orch-wingy-manone-nick-fatool-stanley-wr_gbia0104413a/Get%20Your%20Kicks%20on%20Route%2066%20-%20Wingy%20Manone%27s%20Orch..mp3",
  },
  render: (args) =>
    `<ycl-audio src="${args.url}">${args.content ? `<p>${args.content}</p>` : ''}</ycl-audio>`,
};

export const Default = {};

export const NoContent = {
  args: {
    content: '',
  },
};

export const SlottedAudioElement = {
  render: (args) =>
    `<ycl-audio>
      <p>${args.content}</p>
      <audio slot="audio" preload="metadata">
        <source src="${args.url}" type="audio/mpeg">
      </audio>
    </ycl-audio>`,
};
