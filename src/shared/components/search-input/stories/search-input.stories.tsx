import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { SearchInput, SearchInputProps } from "../search-input";

export default {
  title: "Components / SearchInput",
  component: SearchInput,
  argTypes: {
    onSearch: { action: "onSearch" },
  },
} as Meta;

const Template: Story<SearchInputProps> = (args) => <SearchInput {...args} />;

export const Basic = Template.bind({});
