import React from "react";
import { HashRouter } from "react-router-dom";
import { Story, Meta } from "@storybook/react/types-6-0";
import { BreadCrumbPath, BreadCrumbPathProps } from "../breadcrumb-path";

export default {
  title: "Components / BreadcrumbPath",
  component: BreadCrumbPath,
  argTypes: {},
} as Meta;

const Template: Story<BreadCrumbPathProps> = (args) => (
  <HashRouter>
    <BreadCrumbPath {...args} />
  </HashRouter>
);

export const Single = Template.bind({});
Single.args = {
  breadcrumbs: [
    {
      title: "first",
      path: "/first",
    },
  ],
};

export const Multiple = Template.bind({});
Multiple.args = {
  breadcrumbs: [
    {
      title: "first",
      path: "/first",
    },
    {
      title: "second",
      path: "/second",
    },
    {
      title: "thrid",
      path: "/thrid",
    },
  ],
};
