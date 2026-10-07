import "./Pager";
export default {
  title: 'Molecules/Pager',
  component: 'ycl-pager',
  argTypes: {
    currentPage: {control: { type: 'number', min: 1, max: 50, step: 1 }},
    totalPages: {control: { type: 'number', min: 1, max: 50, step: 1 }},
    baseUrl: {control: 'text'},
},
  args: {
    currentPage: 1,
    totalPages: 10,
    baseUrl: '/news',
},

  // Returns a live element so clicks can page in place instead of navigating away.
  render: (args) => {
    const pager = document.createElement('ycl-pager');
    pager.setAttribute('current', args.currentPage);
    pager.setAttribute('total-pages', args.totalPages);
    pager.setAttribute('base-url', args.baseUrl);
    pager.addEventListener('ycl-page-change', (event) => {
      event.preventDefault();
      pager.current = event.detail.page;
    });
    return pager;
  },
};

export const Default = {};

export const Middle = {
  args: {
    currentPage: 5,
  },
};

export const LastPage = {
  args: {
    currentPage: 10,
  },
};

export const FewPages = {
  args: {
    currentPage: 2,
    totalPages: 3,
  },
};
