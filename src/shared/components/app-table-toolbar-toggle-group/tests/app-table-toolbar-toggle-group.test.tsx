import React from "react";
import { shallow } from "enzyme";

import { AppTableToolbarToggleGroup } from "../app-table-toolbar-toggle-group";

describe("AppTableToolbarToggleGroup", () => {
  it("Renders without crashing", () => {
    const filtersValue = new Map<string, string[]>();

    filtersValue.set("name", ["carlos", "maria"]);
    filtersValue.set("description", ["engineer", "teacher"]);

    const wrapper = shallow(
      <AppTableToolbarToggleGroup
        categories={[
          {
            key: "name",
            name: "Name",
          },
          {
            key: "description",
            name: "Description",
          },
        ]}
        chips={filtersValue}
        onChange={jest.fn()}
      >
        <span>children</span>
      </AppTableToolbarToggleGroup>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
