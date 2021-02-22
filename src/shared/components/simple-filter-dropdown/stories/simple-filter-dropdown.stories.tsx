import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  SimpleFilterDropdown,
  SimpleFilterDropdownProps,
} from "../simple-filter-dropdown";

export default {
  title: "Components / SimpleFilterDropdown",
  component: SimpleFilterDropdown,
  argTypes: {
    onSelect: { action: "onSelect" },
  },
} as Meta;

const Template: Story<SimpleFilterDropdownProps> = (args) => (
  <SimpleFilterDropdown {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  label: "Select an option",
  options: [
    { key: "option1", name: "Option 1" },
    { key: "option2", name: "Option 2" },
    { key: "option3", name: "Option 3" },
  ],
};
