import "./Pager";
import { attributeArg, eventArg } from "../../../.storybook/story-helpers.js";
export default {
  title: 'Molecules/Pager',
  component: 'ycl-pager',
  argTypes: {
    currentPage: attributeArg('Current page, clamped to 1 to total-pages.', {
      name: 'current',
      control: { type: 'number', min: 1, max: 50, step: 1 },
    }),
    totalPages: attributeArg('Number of pages. A single page hides the pager.', {
      name: 'total-pages',
      control: { type: 'number', min: 1, max: 50, step: 1 },
    }),
    baseUrl: attributeArg('URL the page links point at; the page number is added as ?page=.', { name: 'base-url', control: 'text' }),
    label: attributeArg('Accessible name of the navigation; defaults to "Pagination".', { control: 'text' }),
    onPageChange: eventArg('Fired when a page link is clicked, with detail.page. Cancel it to page in place instead of navigating (as this story does).', {
      name: 'ycl-page-change',
    }),
  },
  args: {
    currentPage: 1,
    totalPages: 10,
    baseUrl: '/news',
    label: '',
  },

  // Returns a live element so clicks can page in place instead of navigating away.
  render: (args) => {
    const pager = document.createElement('ycl-pager');
    if (args.currentPage) pager.setAttribute('current', args.currentPage);
    if (args.totalPages) pager.setAttribute('total-pages', args.totalPages);
    if (args.baseUrl) pager.setAttribute('base-url', args.baseUrl);
    if (args.label) pager.setAttribute('label', args.label);
    pager.addEventListener('ycl-page-change', (event) => {
      event.preventDefault();
      pager.current = event.detail.page;
    });
    return pager;
  },
};

export const Default = {};
