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
