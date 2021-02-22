import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { AppPlaceholder } from "../app-placeholder";

export default {
  title: "Components / AppPlaceholder",
  component: AppPlaceholder,
} as Meta;

const Template: Story<{}> = (args) => <AppPlaceholder {...args} />;

export const Basic = Template.bind({});
