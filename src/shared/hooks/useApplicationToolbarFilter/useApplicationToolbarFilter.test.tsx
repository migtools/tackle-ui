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
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { renderHook, act } from "@testing-library/react-hooks";
import { useApplicationToolbarFilter } from "./useApplicationToolbarFilter";
import { ApplicationFilterKey } from "Constants";

describe("useApplicationToolbarFilter", () => {
  it("Empty filter", () => {
    // Router
    const history = createMemoryHistory({ initialEntries: ["/myurl"] });

    // Hook
    const { result } = renderHook(() => useApplicationToolbarFilter(), {
      wrapper: ({ children }) => <Router history={history}>{children}</Router>,
    });

    expect(result.current.isPresent).toBe(false);
    expect(result.current.filters).toMatchObject(new Map());
  });

  it("Init filters from queryParams", () => {
    // Router
    const history = createMemoryHistory({
      initialEntries: [
        "/myurl?name=myApp&description=myDescription&business_service=1&tag=11",
      ],
    });

    // Hook
    const { result } = renderHook(() => useApplicationToolbarFilter(), {
      wrapper: ({ children }) => <Router history={history}>{children}</Router>,
    });

    expect(result.current.isPresent).toBe(true);

    expect(
      result.current.filters.get(ApplicationFilterKey.NAME)
    ).toMatchObject([{ key: "myApp", node: "myApp" }]);
    expect(
      result.current.filters.get(ApplicationFilterKey.DESCRIPTION)
    ).toMatchObject([{ key: "myDescription", node: "myDescription" }]);
    expect(
      result.current.filters.get(ApplicationFilterKey.BUSINESS_SERVICE)
    ).toMatchObject([{ key: "1" }]);
    expect(result.current.filters.get(ApplicationFilterKey.TAG)).toMatchObject([
      { key: "11" },
    ]);
  });

  it("Change filters and fire a change in the URL", () => {
    // Router
    const history = createMemoryHistory({ initialEntries: ["/myurl"] });

    // Hook
    const { result } = renderHook(() => useApplicationToolbarFilter(), {
      wrapper: ({ children }) => <Router history={history}>{children}</Router>,
    });

    // Change filters
    act(() => {
      result.current.setFilter(ApplicationFilterKey.TAG, [
        { key: "1", node: <span>Tag1</span> },
        { key: "2", node: <span>Tag2</span> },
      ]);
    });

    expect(history.location).toMatchObject({
      pathname: "/myurl",
      search: "?tag=1&tag=2",
    });
  });
});
