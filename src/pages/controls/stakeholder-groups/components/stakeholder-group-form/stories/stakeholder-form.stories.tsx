import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  StakeholderGroupForm,
  StakeholderGroupFormProps,
} from "../stakeholder-group-form";
import { Modal } from "@patternfly/react-core";

export default {
  title: "Stakeholders / StakeholderGroupForm",
  component: StakeholderGroupForm,
  argTypes: {
    onCancel: { action: "onCancel" },
  },
} as Meta;

const Template: Story<StakeholderGroupFormProps> = (args) => (
  <StakeholderGroupForm {...args} />
);

const TemplateModal: Story<StakeholderGroupFormProps> = (args) => (
  <Modal isOpen={true} title="My modal title">
    <StakeholderGroupForm {...args} />
  </Modal>
);

export const Basic = Template.bind({});

export const InModal = TemplateModal.bind({});
