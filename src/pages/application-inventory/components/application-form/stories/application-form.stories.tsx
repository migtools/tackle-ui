import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { ApplicationForm, ApplicationFormProps } from "../application-form";
import { Modal } from "@patternfly/react-core";

export default {
  title: "Applications / ApplicationForm",
  component: ApplicationForm,
  argTypes: {
    onCancel: { action: "onCancel" },
  },
} as Meta;

const Template: Story<ApplicationFormProps> = (args) => (
  <ApplicationForm {...args} />
);

const TemplateModal: Story<ApplicationFormProps> = (args) => (
  <Modal isOpen={true} title="My modal title">
    <ApplicationForm {...args} />
  </Modal>
);

export const Basic = Template.bind({});

export const InModal = TemplateModal.bind({});
