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
  ConditionalRender,
  ConditionalRenderProps,
} from "../conditional-render";

export default {
  title: "Components / ConditionalRender",
  component: ConditionalRender,
} as Meta;

const Template: Story<ConditionalRenderProps> = (args) => (
  <ConditionalRender {...args} then="Loading...">
    I'm the content
  </ConditionalRender>
);

export const WhenTrue = Template.bind({});
WhenTrue.args = {
  when: true,
};

export const WhenFalse = Template.bind({});
WhenFalse.args = {
  when: false,
};
