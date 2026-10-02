import "./ReadTime";

const paragraphs = [
  'Yale University Divinity School is a graduate professional school within a world-class research university and is both a rigorous academic institution and an ecumenical community of faith. We stand between the more strictly academic approach of a department of religion and the more practical, parochial orientation of the seminaries.',
  'We educate and prepare the scholars, ministers, and leaders of the future. Our faculty are leading scholars in their respective disciplines and their commitments to supporting students is academically and programmatically unparalleled.',
  'Students from a full spectrum of Christian denominations and faiths attend YDS to begin a lifetime of ministry, scholarship, and service to church and world. YDS students take advantage of the full resources of Yale University and our extraordinary library system.',
  'Many students take courses across Yale and benefit from the cultural and social life of a world-class university. From scholars and researchers to politicians and athletes, we have produced some of the world\'s most influential leaders since the school\'s inception in 1822.',
];

export default {
  title: 'Read Time',
  component: 'ycl-read-time',
  argTypes: {
    label: {control: 'text'},
    repeat: {name: 'Content length (x4 paragraphs)', control: {type: 'number', min: 0, max: 10, step: 1}},
},
  args: {
    label: 'Estimated read time',
    repeat: 3,
},

  render: (args) =>
    `<article id="read-time-story-${args.repeat}">
      <ycl-read-time label="${args.label}" target="#read-time-story-${args.repeat}"></ycl-read-time>
      ${Array.from({length: args.repeat}, () => paragraphs.map((p) => `<p>${p}</p>`).join('')).join('')}
    </article>`,
};

export const Default = {};

export const ShortContent = {
  args: {
    repeat: 1,
  },
};

// With no target attribute (and no #main-content on the page) it measures its parent element.
export const ParentFallback = {
  render: () =>
    `<section>
      <ycl-read-time></ycl-read-time>
      ${paragraphs.map((p) => `<p>${p}</p>`).join('')}
    </section>`,
};
