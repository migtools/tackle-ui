import React from "react";
import { shallow } from "enzyme";

import { Stakeholder } from "api/models";
import { SelectMember } from "../select-member";

describe("SelectMember", () => {
  const STAKEHOLDERS: Stakeholder[] = [
    {
      email: "aa@domain.com",
      displayName: "Aa",
    },
    {
      email: "bb@domain.com",
      displayName: "Bb",
    },
  ];

  it("Renders without crashing", () => {
    const wrapper = shallow(
      <SelectMember
        stakeholders={STAKEHOLDERS}
        onSelect={jest.fn()}
        onClear={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
