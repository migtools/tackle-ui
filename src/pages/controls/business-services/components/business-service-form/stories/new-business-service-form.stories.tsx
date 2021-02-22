import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  BusinessServiceForm,
  BusinessServiceFormProps,
} from "../business-service-form";
import { Modal } from "@patternfly/react-core";

export default {
  title: "Components / NewBusinessServiceForm",
  component: BusinessServiceForm,
  argTypes: {
    onCancel: { action: "onCancel" },
  },
} as Meta;

const Template: Story<BusinessServiceFormProps> = (args) => (
  <BusinessServiceForm {...args} />
);

const TemplateModal: Story<BusinessServiceFormProps> = (args) => (
  <Modal isOpen={true} title="My modal title">
    <BusinessServiceForm {...args} />
  </Modal>
);

export const Basic = Template.bind({});

export const InModal = TemplateModal.bind({});
