import React from "react";
import { shallow } from "enzyme";

import { StakeholderGroup } from "api/models";
import { SelectGroup } from "../select-group";

describe("SelectGroup", () => {
  const GROUPS: StakeholderGroup[] = [
    {
      name: "aa",
      description: "somethingA",
    },
    {
      name: "bb",
      description: "somethingB",
    },
  ];

  it("Renders without crashing", () => {
    const wrapper = shallow(
      <SelectGroup groups={GROUPS} onSelect={jest.fn()} onClear={jest.fn()} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
