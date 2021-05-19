import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { ConfirmDialog, ConfirmDialogProps } from "../confirm-dialog";
import { ButtonVariant } from "@patternfly/react-core";

export default {
  title: "Components / ConfirmDialog",
  component: ConfirmDialog,
  argTypes: {
    onClose: { action: "close" },
    onConfirm: { action: "confirm" },
    onCancel: { action: "cancel" },
  },
} as Meta;

const Template: Story<ConfirmDialogProps> = (args) => (
  <ConfirmDialog {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  isOpen: true,
  title: "Delete project",
  message: "Are you sure you want to delete the project 'ABC'",
  confirmBtnVariant: ButtonVariant.primary,
  confirmBtnLabel: "Yes",
  cancelBtnLabel: "Cancel",
};

export const InProgress = Template.bind({});
InProgress.args = {
  ...Basic.args,
  inProgress: true,
};

export const WithoutCancel = Template.bind({});
WithoutCancel.args = {
  ...Basic.args,
  onCancel: undefined,
};
