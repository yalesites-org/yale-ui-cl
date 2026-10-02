import "./Video";
export default {
  title: 'Video',
  component: 'ycl-video',
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    heading: {control: 'text'},
    text: {control: 'text'},
    alignment: {
      name: 'Video Placement',
      type: 'select',
      options: ['left', 'center'],
    },
    width: {
      name: 'Width',
      type: 'select',
      options: ['max', 'site', 'highlight', 'content'],
    },
  },
  args: {
    heading: 'This Is Where A Video Title Will Go',
    text: 'This is where captions for videos will go.',
    alignment: 'left',
    width: 'site',
  },

  render: (args) =>
    `<ycl-video alignment="${args.alignment}" width="${args.width}">
      <iframe width="560" height="315" src="https://www.youtube.com/embed/GL5XhmKCXo0" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      ${args.heading ? `<h2 slot="heading">${args.heading}</h2>` : ''}
      ${args.text ? `<p slot="text">${args.text}</p>` : ''}
    </ycl-video>`,
};

export const Default = {};

export const Centered = {
  args: {
    alignment: 'center',
  },
};

export const VideoOnly = {
  args: {
    heading: '',
    text: '',
  },
};
