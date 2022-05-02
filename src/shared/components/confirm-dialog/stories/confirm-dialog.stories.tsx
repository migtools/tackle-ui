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
