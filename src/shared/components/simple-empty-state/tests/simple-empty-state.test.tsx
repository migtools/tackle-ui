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
import { shallow } from "enzyme";
import { AdIcon } from "@patternfly/react-icons";

import { SimpleEmptyState } from "../simple-empty-state";

describe("SimpleEmptyState", () => {
  it("Renders without crashing", () => {
    const wrapper = shallow(<SimpleEmptyState title="my title" />);
    expect(wrapper).toMatchSnapshot();
  });

  it("Renders with icon", () => {
    const wrapper = shallow(
      <SimpleEmptyState title="my title" icon={AdIcon} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Renders with description", () => {
    const wrapper = shallow(
      <SimpleEmptyState title="my title" description="my description" />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Renders with primaryAction", () => {
    const wrapper = shallow(
      <SimpleEmptyState
        title="my title"
        description="my description"
        primaryAction={<button>My action</button>}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
