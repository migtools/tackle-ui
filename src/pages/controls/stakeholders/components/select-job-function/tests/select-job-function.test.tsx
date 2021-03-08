import React from "react";
import { shallow } from "enzyme";

import { JobFunction } from "api/models";
import { SelectJobFunction } from "../select-job-function";

describe("SelectJobFunction", () => {
  const JOBFUNCTIONS: JobFunction[] = [
    {
      id: 1,
      role: "Aa",
    },
    {
      id: 2,
      role: "Bb",
    },
  ];

  it("Renders without crashing", () => {
    const wrapper = shallow(
      <SelectJobFunction
        jobFunctions={JOBFUNCTIONS}
        onSelect={jest.fn()}
        onClear={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
