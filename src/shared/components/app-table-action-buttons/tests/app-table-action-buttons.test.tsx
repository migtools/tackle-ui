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
import { mount, shallow } from "enzyme";

import { AppTableActionButtons } from "../app-table-action-buttons";

describe("AppTableActionButtons", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(
      <AppTableActionButtons onEdit={jest.fn()} onDelete={jest.fn()} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Callback edit", () => {
    const callbackSpy = jest.fn();
    const wrapper = mount(
      <AppTableActionButtons onEdit={callbackSpy} onDelete={jest.fn()} />
    );

    wrapper.find('button[aria-label="edit"]').simulate("click");

    expect(callbackSpy).toHaveBeenCalledTimes(1);
  });

  it("Callback delete", () => {
    const callbackSpy = jest.fn();
    const wrapper = mount(
      <AppTableActionButtons onEdit={jest.fn()} onDelete={callbackSpy} />
    );

    wrapper.find('button[aria-label="delete"]').simulate("click");

    expect(callbackSpy).toHaveBeenCalledTimes(1);
  });
});
