import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { StakeholderForm, StakeholderFormProps } from "../stakeholder-form";
import { Modal } from "@patternfly/react-core";

export default {
  title: "Stakeholders / StakeholderForm",
  component: StakeholderForm,
  argTypes: {
    onCancel: { action: "onCancel" },
  },
} as Meta;

const Template: Story<StakeholderFormProps> = (args) => (
  <StakeholderForm {...args} />
);

const TemplateModal: Story<StakeholderFormProps> = (args) => (
  <Modal isOpen={true} title="My modal title">
    <StakeholderForm {...args} />
  </Modal>
);

export const Basic = Template.bind({});

export const InModal = TemplateModal.bind({});
