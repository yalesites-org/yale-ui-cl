import { Divider } from "./divider";
export default {
  title: 'divider',
  component: 'ycl-divider',
  argTypes: {
    label: {control: 'text'},
    
},
  args: {
    label: 'Example divider',
},

  render: (args) => 
    `<ycl-divider>
      
    </ycl-divider>`
}

export const Default = {

  render: (args) =>
    `<ycl-divider>
      
    </ycl-divider>`
};

