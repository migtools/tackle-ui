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
import { mount } from "enzyme";
import { NodeFetch } from "../node-fetch";

describe("NodeFetch", () => {
  it("Renders loading...", () => {
    const wrapper = mount(<NodeFetch isFetching={true} node="myChip" />);
    expect(wrapper.text()).toBe(" terms.loading...");
  });

  it("Renders error...", () => {
    const wrapper = mount(
      <NodeFetch isFetching={true} fetchError={"error"} node="myChip" />
    );
    expect(wrapper.text()).toBe("terms.unknown");
  });

  it("Renders chip...", () => {
    const wrapper = mount(<NodeFetch isFetching={false} node="myChip" />);
    expect(wrapper.text()).toBe("myChip");
  });
});
