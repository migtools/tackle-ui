import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { action } from "@storybook/addon-actions";
import { MenuActions, MenuActionsProps } from "../menu-actions";

export default {
  title: "Components / MenuActions",
  component: MenuActions,
  argTypes: {},
} as Meta;

const Template: Story<MenuActionsProps> = (args) => <MenuActions {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  actions: [
    {
      label: "Action1",
      callback: action("Action1 callback"),
    },
    {
      label: "Action2",
      callback: action("Action2 callback"),
    },
  ],
};
