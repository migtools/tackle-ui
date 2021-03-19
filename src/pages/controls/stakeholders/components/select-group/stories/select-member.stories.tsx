import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { SelectGroup, SelectGroupProps } from "../select-group";
import { StakeholderGroup } from "api/models";

export default {
  title: "StakeHolders / SelectGroup",
  component: SelectGroup,
  argTypes: {
    onSelect: { action: "onSelect" },
    onClear: { action: "onClear" },
  },
} as Meta;

const Template: Story<SelectGroupProps> = (args) => <SelectGroup {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  stakeholderGroups: [
    {
      name: "aa",
      description: "somethingA",
    },
    {
      name: "bb",
      description: "somethingB",
    },
  ],
};

export const WithValue = Template.bind({});
WithValue.args = {
  ...Basic.args,
  value: [
    {
      name: "value has not to be in options",
      description: "any description",
    },
  ],
};

const bigGroups: StakeholderGroup[] = [];
for (let index = 0; index < 100; index++) {
  bigGroups.push({
    name: `option${index}`,
    description: `description${index}`,
  });
}

export const BigOptions = Template.bind({});
BigOptions.args = {
  stakeholderGroups: bigGroups,
};

export const IsFetching = Template.bind({});
IsFetching.args = {
  ...Basic.args,
  isFetching: true,
};

export const Error = Template.bind({});
Error.args = {
  ...Basic.args,
  fetchError: {
    name: "error",
    isAxiosError: true,
    message: "An error message",
    toJSON: () => ({}),
    config: {},
  },
};
