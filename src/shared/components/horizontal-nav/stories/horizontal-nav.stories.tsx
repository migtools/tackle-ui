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
import { HorizontalNav, HorizontalNavProps } from "../horizontal-nav";

export default {
  title: "Components / HorizontalNav",
  component: HorizontalNav,
  argTypes: {},
} as Meta;

const Template: Story<HorizontalNavProps> = (args) => (
  <HashRouter>
    <HorizontalNav {...args} />
  </HashRouter>
);

export const Single = Template.bind({});
Single.args = {
  navItems: [
    {
      title: "first",
      path: "/first",
    },
  ],
};

export const Multiple = Template.bind({});
Multiple.args = {
  navItems: [
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
