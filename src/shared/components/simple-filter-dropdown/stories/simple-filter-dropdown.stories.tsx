/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
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
