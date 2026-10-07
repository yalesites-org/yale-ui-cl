import "./Embed";
export default {
  title: 'Molecules/Embed',
  component: 'ycl-embed',
  argTypes: {
    src: {control: 'text'},
    label: {control: 'text'},
    width: {
      name: 'Width',
      type: 'select',
      options: ['max', 'site', 'highlight', 'content'],
    },
    type: {
      name: 'Type',
      type: 'select',
      options: ['form', 'audio', 'map', 'calendar', 'video'],
    },
    loading: {
      name: 'Loading',
      type: 'select',
      options: ['lazy', 'eager'],
    },
  },
  args: {
    src: 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/320687463',
    label: 'Example SoundCloud Track',
    width: 'site',
    type: 'audio',
    loading: 'lazy',
  },

  render: (args) =>
    `<ycl-embed src="${args.src}" label="${args.label}" width="${args.width}" type="${args.type}" loading="${args.loading}"></ycl-embed>`,
};

export const Default = {};

export const MicrosoftForms = {
  args: {
    src: 'https://forms.office.com/Pages/ResponsePage.aspx?id=u76M3Tkh-E20EU4-h6vrXJ-OMhrDFtBEifIUjjt2g_xURUVBU1IyUVlTVFFFNjJQQzJXM1pNMVozVi4u&embed=true',
    label: 'Example Microsoft Form',
    type: 'form',
  },
};

export const GoogleMaps = {
  args: {
    src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5993.31404257508!2d-72.92491802386455!3d41.316324371308916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e7d9b6cd624945%3A0xae34a2c4b4d30427!2sYale%20University!5e0!3m2!1sen!2sca!4v1746124034200!5m2!1sen!2sca',
    label: 'Map of Yale University',
    type: 'map',
  },
};

export const GoogleCalendar = {
  args: {
    src: 'https://calendar.google.com/calendar/embed?src=en.usa%23holiday%40group.v.calendar.google.com&ctz=America%2FNew_York',
    label: 'Example Google Calendar',
    type: 'calendar',
  },
};

export const Video = {
  args: {
    src: 'https://www.youtube.com/embed/GL5XhmKCXo0',
    label: 'YouTube video player',
    type: 'video',
    width: 'content',
  },
};

// Script-driven embeds go in the default slot instead of src.
export const ScriptEmbed = {
  render: (args) =>
    `<ycl-embed width="${args.width}">
      <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Yale scientists find a common weed harbors important clues about how to create drought resistant crops in a world beset by climate change. <a href="https://twitter.com/yale_eeb">@yale_eeb</a></p>&mdash; Yale University (@Yale) <a href="https://twitter.com/Yale/status/1586724355089776640">October 30, 2022</a></blockquote>
      <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    </ycl-embed>`,
};
