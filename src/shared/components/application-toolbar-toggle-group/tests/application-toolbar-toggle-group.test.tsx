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
import { Toolbar, ToolbarChip, ToolbarContent } from "@patternfly/react-core";
import { ApplicationFilterKey } from "Constants";
import { ApplicationToolbarToggleGroup } from "../application-toolbar-toggle-group";

describe("ApplicationToolbarToggleGroup", () => {
  const value = new Map<ApplicationFilterKey, ToolbarChip[]>();
  value.set(ApplicationFilterKey.TAG, [{ key: "1", node: "Tag1" }]);

  it("Renders without crashing", () => {
    const wrapper = mount(
      <Toolbar>
        <ToolbarContent>
          <ApplicationToolbarToggleGroup
            value={value}
            addFilter={jest.fn()}
            setFilter={jest.fn()}
          />
        </ToolbarContent>
      </Toolbar>
    );
  });
});
