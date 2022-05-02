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
import { SimpleFilterDropdown } from "../simple-filter-dropdown";

describe("SimpleFilterDropdown", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <SimpleFilterDropdown
        label="My label"
        options={[
          { key: "option1", name: "Option 1" },
          { key: "option2", name: "Option 2" },
          { key: "option3", name: "Option 3" },
        ]}
        onSelect={jest.fn()}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Check onSelect callback", () => {
    const onSelectSpy = jest.fn();

    const wrapper = mount(
      <SimpleFilterDropdown
        label="My label"
        options={[
          { key: "option1", name: "Option 1" },
          { key: "option2", name: "Option 2" },
          { key: "option3", name: "Option 3" },
        ]}
        onSelect={onSelectSpy}
      />
    );

    // Open dropdown
    wrapper.find(".pf-c-dropdown__toggle").simulate("click");
    wrapper.update();

    // Select option
    wrapper.find(".pf-c-dropdown__menu-item").at(1).simulate("click");
    expect(onSelectSpy).toHaveBeenCalledWith({
      key: "option2",
      name: "Option 2",
    });
  });
});
