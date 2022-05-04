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
import {
  BusinessServiceForm,
  BusinessServiceFormProps,
} from "../business-service-form";
import { Modal } from "@patternfly/react-core";

export default {
  title: "BusinessServices / BusinessServiceForm",
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
