import "./Text";
import "../../01-atoms/text-link/Link";
import { attrs, attributeArg, slotArg } from "../../../.storybook/story-helpers.js";

const sampleContent = `
  <h2>About YDS</h2>
  <p>“From scholars and researchers to politicians and athletes, we have produced some of the world’s most influential leaders since the school’s inception in 1822. To date, we have put forward more presidents and deans of colleges, universities and seminaries, as well as heads of denominations, than any other divinity school or seminary in the United States.”</p>
  <h2>Admissions & Financial Aid</h2>
  <h3>Yale Divinity School - Inspiring the Minds That Inspire the World!</h3>
  <p>Yale University Divinity School is a <text-link href="#">graduate professional school</text-link> within a world-class research university and is both a rigorous academic institution and an ecumenical community of faith. We educate and prepare the scholars, ministers, and leaders of the future.</p>
  <h4>Tuition and Financial Aid</h4>
  <p><text-link href="https://www.yale.edu">Information</text-link> on the cost to attend, applying for financial aid, international student financial aid, fees, and more.</p>
  <h5>Financial planning with iGrad</h5>
  <p>A powerful online organizational tool to assist you in planning for your financial needs now and in the future.</p>
  <h6>How does it work?</h6>
  <ul>
    <li>Sign in with your NetID and password to access your iGrad dashboard.</li>
    <li>Start with a brief financial wellness assessment.</li>
    <li>View articles and videos to help you build up your financial skill set.</li>
  </ul>
  <h2>Inline elements</h2>
  <p>These are some additional inline elements that will be possible within wysiwygs.
  <strong>Strong is used to indicate strong importance</strong><br>
  <em>This text has added emphasis</em><br>
  <s>This text has a strike-through</s><br>
  Superscript<sup>1 2</sup><br>
  Subscript for things like H<sub>2</sub>O<br>
  <code>This is what inline code looks like.</code></p>
  <pre><code>/** This is what a block of code looks like. **/
{
    padding: 0 var(--size-spacing-3);
    background-color: var(--color-code-background);
}</code></pre>
`;

export default {
  title: 'Molecules/Text',
  component: 'ycl-text',
  argTypes: {
    variation: attributeArg('emphasized sets the text in a highlighted block.', {
      name: 'Text Field Variation',
      control: 'select',
      options: ['default', 'emphasized'],
      mapping: { default: undefined },
    }),
    alignment: attributeArg('Position of the text column; center is the default.', {
      name: 'Alignment',
      control: 'select',
      options: ['center', 'left'],
      mapping: { center: undefined },
    }),
    width: attributeArg('Maximum width of the text column.', {
      control: 'select',
      options: ['default', 'content', 'highlight', 'max'],
      mapping: { default: undefined },
    }),
    content: slotArg('Rich text (headings, paragraphs, lists, code) in the default slot.', { control: false }),
  },
  args: {
    variation: 'default',
    alignment: 'center',
    width: 'default',
  },

  render: (args) =>
    `<ycl-text${attrs({ variation: args.variation, alignment: args.alignment, width: args.width })}>${sampleContent}</ycl-text>`,
};

export const Default = {};
