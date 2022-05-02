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
import { HashRouter } from "react-router-dom";
import { Story, Meta } from "@storybook/react/types-6-0";
import { action } from "@storybook/addon-actions";
import { PageHeader, PageHeaderProps } from "../page-header";

export default {
  title: "Components / PageHeader",
  component: PageHeader,
  argTypes: {},
} as Meta;

const Template: Story<PageHeaderProps> = (args) => (
  <HashRouter>
    <PageHeader {...args} />
  </HashRouter>
);
export const Basic = Template.bind({});
Basic.args = {
  title: "mycompany",
  breadcrumbs: [
    {
      title: "Companies",
      path: "/companies",
    },
    {
      title: "Company details",
      path: "/companies/1",
    },
  ],
  menuActions: [
    {
      label: "Edit",
      callback: action("Edit"),
    },
    {
      label: "Delete",
      callback: action("Delete"),
    },
  ],
  navItems: [
    {
      title: "Overview",
      path: "/companies/1/overview",
    },
    {
      title: "YAML",
      path: "/companies/1/yaml",
    },
    {
      title: "SUNAT",
      path: "/companies/1/sunat",
    },
  ],
};
