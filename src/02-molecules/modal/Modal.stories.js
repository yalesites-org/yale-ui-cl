import "./Modal";
import "../../01-atoms/headings/Heading";
import "../../01-atoms/button/Button";
import "../../01-atoms/cta/Cta";
import "../../01-atoms/text-link/Link";
import { attrs, attributeArg, slotArg, eventArg } from "../../../.storybook/story-helpers.js";
export default {
  title: 'Molecules/Modal',
  component: 'ycl-modal',
  argTypes: {
    open: attributeArg('Opens the modal. The attribute is the source of truth: show() and close() set and remove it, and it is removed when the modal closes itself.', {
      control: 'boolean',
    }),
    heading: slotArg('Modal title (slot="heading"); it labels the dialog. Omitted when empty.', { control: 'text' }),
    content: slotArg('Modal body (default slot). Omitted when empty.', { control: 'text' }),
    withLinks: slotArg('Adds a text link and a CTA to the default slot.', { name: 'With Links', control: 'boolean' }),
    onOpen: eventArg('Fired when the modal opens.', { name: 'open' }),
    onClose: eventArg('Fired when the modal closes, however it was closed (close button, backdrop, Escape, or removing open).', { name: 'close' }),
  },
  args: {
    open: false,
    heading: 'Modal title',
    content: 'Modal content',
    withLinks: false,
  },

  render: (args) =>
    `<ycl-button onclick="document.getElementById('demo-modal').show()">Demo Modal</ycl-button>
    <ycl-modal${attrs({ id: 'demo-modal', open: args.open })}>
      ${args.heading ? `<ycl-heading level="2" slot="heading">${args.heading}</ycl-heading>` : ''}
      ${args.content ? `<p>${args.content}</p>` : ''}
      ${args.withLinks ? `<p><text-link href="https://www.yale.edu">Yale University</text-link></p>
      <cta-link class="filled" href="https://www.yale.edu">Book a tour</cta-link>` : ''}
    </ycl-modal>`,
};

export const Default = {};
