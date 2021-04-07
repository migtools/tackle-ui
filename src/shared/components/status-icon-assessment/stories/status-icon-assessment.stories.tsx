import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  StatusIconAssessment,
  IStatusIconAssessmentProps,
} from "../status-icon-assessment";

export default {
  title: "Components / StatusIconAssessment",
  component: StatusIconAssessment,
} as Meta;

const Template: Story<IStatusIconAssessmentProps> = (args) => (
  <StatusIconAssessment {...args} />
);

export const NotStarted = Template.bind({});
NotStarted.args = {
  status: "NotStarted",
};

export const InProgress = Template.bind({});
InProgress.args = {
  status: "InProgress",
};

export const Completed = Template.bind({});
Completed.args = {
  status: "Completed",
};
