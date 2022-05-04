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
import { IExtraColumnData, SortByDirection } from "@patternfly/react-table";
import { renderHook, act } from "@testing-library/react-hooks";
import { DEFAULT_PAGINATION } from "Constants";
import { useTableControls } from "./useTableControls";

describe("useTableControls", () => {
  it("Update pagination correctly", () => {
    const { result } = renderHook(() => useTableControls());

    //
    const { handlePaginationChange } = result.current;
    act(() => handlePaginationChange({ page: 2, perPage: 50 }));
    expect(result.current.paginationQuery).toMatchObject({
      page: 2,
      perPage: 50,
    });
  });

  it("Update state sortBy correctly", () => {
    const COLUMN_INDEX = 2;

    const { result } = renderHook(() => useTableControls());

    //
    const { handleSortChange } = result.current;
    act(() =>
      handleSortChange(
        jest.fn() as any,
        COLUMN_INDEX,
        SortByDirection.desc,
        jest.fn() as any
      )
    );

    expect(result.current.sortByQuery).toMatchObject({
      index: COLUMN_INDEX,
      direction: SortByDirection.desc,
    });
  });

  it("Start with default pagination", () => {
    const { result } = renderHook(() =>
      useTableControls({ paginationQuery: { page: 2, perPage: 50 } })
    );

    //
    const { paginationQuery } = result.current;

    expect(paginationQuery.page).toBe(2);
    expect(paginationQuery.perPage).toBe(50);
  });

  it("Start with default sortBy", () => {
    const { result } = renderHook(() =>
      useTableControls({
        paginationQuery: DEFAULT_PAGINATION,
        sortByQuery: { index: 2, direction: "desc" },
      })
    );

    //
    const { sortByQuery } = result.current;

    expect(sortByQuery?.index).toBe(2);
    expect(sortByQuery?.direction).toBe("desc");
  });

  it("Doesn't allow Zero or negative page values", () => {
    const { result } = renderHook(() => useTableControls());

    const { handlePaginationChange } = result.current;

    // Zero
    act(() => handlePaginationChange({ page: 0, perPage: 50 }));
    expect(result.current.paginationQuery).toMatchObject({
      page: 1,
      perPage: 50,
    });

    // Negative
    act(() => handlePaginationChange({ page: -1, perPage: 50 }));
    expect(result.current.paginationQuery).toMatchObject({
      page: 1,
      perPage: 50,
    });
  });
});
