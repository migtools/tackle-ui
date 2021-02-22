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
