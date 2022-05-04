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
