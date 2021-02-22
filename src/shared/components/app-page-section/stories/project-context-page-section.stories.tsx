import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { AppPageSection } from "../app-page-section";

export default {
  title: "Components / ProjectContextPageSection",
  component: AppPageSection,
} as Meta;

const Template: Story<{}> = (args) => (
  <AppPageSection {...args}>my app content</AppPageSection>
);

export const Basic = Template.bind({});
Basic.args = {};
