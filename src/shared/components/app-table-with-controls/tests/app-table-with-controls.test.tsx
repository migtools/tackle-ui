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
import { ICell } from "@patternfly/react-table";

import { AppTableWithControls } from "../app-table-with-controls";

describe("AppTableWithControls", () => {
  const columns: ICell[] = [{ title: "Col1" }];
  const itemsToRow = (items: string[]) => {
    return items.map((item) => ({
      cells: [
        {
          title: item,
        },
      ],
    }));
  };

  it("Renders without crashing", () => {
    const wrapper = shallow(
      <AppTableWithControls
        count={120}
        rows={[{ cells: ["first", "second", "third"] }]}
        pagination={{ page: 1, perPage: 10 }}
        onPaginationChange={jest.fn()}
        onSort={jest.fn()}
        cells={columns}
        isLoading={false}
        filtersApplied={false}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it("Renders adding toolbar", () => {
    const wrapper = shallow(
      <AppTableWithControls
        count={120}
        rows={[{ cells: ["first", "second", "third"] }]}
        pagination={{ page: 1, perPage: 10 }}
        onPaginationChange={jest.fn()}
        onSort={jest.fn()}
        cells={columns}
        isLoading={false}
        toolbarActions={<p>This is an additional content to toolbar</p>}
        filtersApplied={false}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
