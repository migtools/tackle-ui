import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { SelectMember, SelectMemberProps } from "../select-member";
import { Stakeholder } from "api/models";

export default {
  title: "StakeHolderGroups / SelectMember",
  component: SelectMember,
  argTypes: {
    onSelect: { action: "onSelect" },
    onClear: { action: "onClear" },
  },
} as Meta;

const Template: Story<SelectMemberProps> = (args) => <SelectMember {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  stakeholders: [
    {
      displayName: "aa",
      email: "aa@domain.com",
    },
    {
      displayName: "bb",
      email: "bb@domain.com",
    },
  ],
};

export const WithValue = Template.bind({});
WithValue.args = {
  ...Basic.args,
  value: [
    {
      displayName: "value has not to be in options",
      email: "any@domain.com",
    },
  ],
};

const bigStakeholders: Stakeholder[] = [];
for (let index = 0; index < 100; index++) {
  bigStakeholders.push({
    displayName: `option${index}`,
    email: `email${index}`,
  });
}

export const BigOptions = Template.bind({});
BigOptions.args = {
  stakeholders: bigStakeholders,
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
