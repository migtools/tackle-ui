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
