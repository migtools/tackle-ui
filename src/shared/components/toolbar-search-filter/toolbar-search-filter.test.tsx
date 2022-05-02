/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from "react";
import { shallow, mount } from "enzyme";
import { ToolbarSearchFilter } from "./toolbar-search-filter";

describe("ToolbarSearchFilter", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <ToolbarSearchFilter
        filters={[
          {
            key: "filter1",
            name: "Filter 1",
            input: <input cy-data="filter1" />,
          },
          {
            key: "filter2",
            name: "Filter 2",
            input: <input cy-data="filter2" />,
          },
          {
            key: "filter3",
            name: "Filter 3",
            input: <input cy-data="filter3" />,
          },
        ]}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Renders without crashing when no filter is provided", () => {
    const wrapper = shallow(<ToolbarSearchFilter filters={[]} />);
    expect(wrapper).toMatchSnapshot();
  });

  it("Select appropiate filter", () => {
    const wrapper = mount(
      <ToolbarSearchFilter
        filters={[
          {
            key: "filter1",
            name: "Filter 1",
            input: <input cy-data="filter1" />,
          },
          {
            key: "filter2",
            name: "Filter 2",
            input: <input cy-data="filter2" />,
          },
          {
            key: "filter3",
            name: "Filter 3",
            input: <input cy-data="filter3" />,
          },
        ]}
      />
    );

    // Open dropdown
    wrapper.find(".pf-c-dropdown__toggle").simulate("click");
    wrapper.update();

    // Select option
    wrapper.find(".pf-c-dropdown__menu-item").at(2).simulate("click");
    expect(wrapper.find("input[cy-data='filter3']")).not.toBeNull();
  });
});
