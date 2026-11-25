import "./Container";
import "../headings/Heading";
import "../cta/Cta";
import "../divider/Divider";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

// Narrowest to widest; full has no cap.
const widths = ['content', 'highlight', 'site', 'max', 'full'];

const content = `
  <ycl-heading level="2">Admissions</ycl-heading>
  <p>Yale College offers a liberal arts education that prepares students for a lifetime of learning. Apply online through the admissions office, and visit campus to meet students and faculty.</p>
  <ycl-divider></ycl-divider>
  <ycl-cta-link href="#">Apply now</ycl-cta-link>
`;

export default {
  title: 'Atoms/Container',
  component: 'ycl-container',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'UICL ships no page or section layouts: how a page is laid out is up to whoever builds it. Wrap content in a container so its spacing comes from the spacing tokens and pages built with UICL line up. The container centers its content, caps it at a layout width, pads the sides with the responsive site gutter and, with `spacing="section"`, adds the page section spacing above and below. The shaded background in these stories only shows the container\'s edges.',
      },
    },
  },
  argTypes: {
    width: attributeArg('width: widest the content gets, from the layout width tokens. full has no cap.', {
      name: 'Width',
      control: 'select',
      options: widths,
    }),
    spacing: attributeArg('spacing: section adds the page section spacing above and below.', {
      name: 'Vertical spacing',
      control: 'select',
      options: ['none', 'section'],
    }),
    noGutter: attributeArg('gutter="none": drops the side padding, for a container nested in another.', {
      name: 'No gutter',
      control: 'boolean',
    }),
    content: slotArg('Default slot: the content to wrap.', { control: false }),
  },
  args: {
    width: 'site',
    spacing: 'section',
    noGutter: false,
  },
  render: (args) =>
    `<ycl-container${attrs({
      width: args.width,
      spacing: args.spacing,
      gutter: args.noGutter && 'none',
      style: 'background: var(--color-gray-100);',
    })}>${content}</ycl-container>`,
};

export const Default = {};

export const Widths = {
  parameters: {
    docs: {
      description: {
        story: 'Each layout width, stacked to compare. Controls render one container at a time.',
      },
    },
  },
  render: () => widths.map((width) =>
    `<ycl-container width="${width}" spacing="section" style="background: var(--color-gray-100); margin-block-end: 1rem;">
      <ycl-heading level="3">width="${width}"</ycl-heading>
      <p>${width === 'full' ? 'Content in this container has no width cap.' : `Content in this container is capped at the ${width} layout width.`}</p>
    </ycl-container>`).join(''),
};
