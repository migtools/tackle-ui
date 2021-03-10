import React from "react";
import { shallow } from "enzyme";

import { SelectEntity } from "../select-entity";

describe("SelectEntity", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <SelectEntity
        isMulti={true}
        options={[
          {
            toString: () => "option1",
          },
          {
            toString: () => "option2",
          },
        ]}
        isEqual={jest.fn()}
        onSelect={jest.fn()}
        onClear={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
