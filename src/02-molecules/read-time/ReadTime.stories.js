import "./ReadTime";
import { attrs, attributeArg } from "../../../.storybook/story-helpers.js";

const paragraphs = [
  'Yale University Divinity School is a graduate professional school within a world-class research university and is both a rigorous academic institution and an ecumenical community of faith. We stand between the more strictly academic approach of a department of religion and the more practical, parochial orientation of the seminaries.',
  'We educate and prepare the scholars, ministers, and leaders of the future. Our faculty are leading scholars in their respective disciplines and their commitments to supporting students is academically and programmatically unparalleled.',
  'Students from a full spectrum of Christian denominations and faiths attend YDS to begin a lifetime of ministry, scholarship, and service to church and world. YDS students take advantage of the full resources of Yale University and our extraordinary library system.',
  'Many students take courses across Yale and benefit from the cultural and social life of a world-class university. From scholars and researchers to politicians and athletes, we have produced some of the world\'s most influential leaders since the school\'s inception in 1822.',
];

export default {
  title: 'Molecules/Read Time',
  component: 'ycl-read-time',
  argTypes: {
    label: attributeArg('Text shown before the estimate.', { control: 'text' }),
    target: attributeArg('Selector for the content to measure. Defaults to #main-content, then the parent element. The story points it at the article below.', {
      control: false,
    }),
    wordsPerMinute: attributeArg('Reading speed used for the estimate.', {
      name: 'words-per-minute',
      control: { type: 'number', min: 50, max: 600, step: 10 },
    }),
    repeat: {
      name: 'Content length (x4 paragraphs)',
      control: { type: 'number', min: 0, max: 10, step: 1 },
      description: 'Story-only: how much sample content to measure.',
    },
  },
  args: {
    label: 'Estimated read time',
    wordsPerMinute: 200,
    repeat: 3,
  },

  render: (args) => {
    const repeat = Math.max(0, Number(args.repeat) || 0);
    const id = `read-time-story-${repeat}`;
    return `<article id="${id}">
      <ycl-read-time${attrs({ label: args.label, target: `#${id}`, 'words-per-minute': args.wordsPerMinute })}></ycl-read-time>
      ${Array.from({length: repeat}, () => paragraphs.map((p) => `<p>${p}</p>`).join('')).join('')}
    </article>`;
  },
};

export const Default = {};

export const ParentFallback = {
  parameters: {
    docs: {
      description: {
        story: 'With no target attribute (and no #main-content on the page) it measures its parent element. That depends on where the element sits in the page, which controls cannot change.',
      },
    },
  },
  render: () =>
    `<section>
      <ycl-read-time></ycl-read-time>
      ${paragraphs.map((p) => `<p>${p}</p>`).join('')}
    </section>`,
};
