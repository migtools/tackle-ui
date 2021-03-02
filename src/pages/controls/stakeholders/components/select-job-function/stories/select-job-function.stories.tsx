import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import {
  SelectJobFunction,
  SelectJobFunctionProps,
} from "../select-job-function";
import { JobFunction } from "api/models";

export default {
  title: "BusinessServices / SelectStakeholder",
  component: SelectJobFunction,
  argTypes: {
    onSelect: { action: "onSelect" },
    onClear: { action: "onClear" },
  },
} as Meta;

const Template: Story<SelectJobFunctionProps> = (args) => (
  <SelectJobFunction {...args} />
);

export const Basic = Template.bind({});
Basic.args = {
  jobFunctions: [
    {
      id: 1,
      name: "aa",
    },
    {
      id: 2,
      name: "bb",
    },
  ],
};

export const WithValue = Template.bind({});
WithValue.args = {
  ...Basic.args,
  value: {
    id: 3,
    name: "any",
  },
};

const bigJobFunctions: JobFunction[] = [];
for (let index = 0; index < 100; index++) {
  bigJobFunctions.push({
    id: index,
    name: `function${index}`,
  });
}

export const BigOptions = Template.bind({});
BigOptions.args = {
  jobFunctions: bigJobFunctions,
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
