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
import { useQueryString } from "./useQueryString";

describe("useQueryString", () => {
  it("Extract object from URL query params", () => {
    // Router
    const history = createMemoryHistory({
      initialEntries: [
        "/myurl?name=my%20application1&name=my%20application2&description=my%20description",
      ],
    });

    // Hook
    const { result } = renderHook(() => useQueryString(), {
      wrapper: ({ children }) => <Router history={history}>{children}</Router>,
    });

    expect(result.current[0]).toMatchObject({
      name: ["my application1", "my application2"],
      description: ["my description"],
    });
  });

  it("Use default value", () => {
    const defaultValue = {
      otherKey: ["other value1", "other value2"],
    };

    // Router
    const history = createMemoryHistory({
      initialEntries: [
        "/myurl?name=my%20application1&name=my%20application2&description=my%20description",
      ],
    });

    // Hook
    const { result } = renderHook(() => useQueryString(defaultValue), {
      wrapper: ({ children }) => <Router history={history}>{children}</Router>,
    });

    expect(result.current[0]).toMatchObject({
      name: ["my application1", "my application2"],
      description: ["my description"],
      otherKey: ["other value1", "other value2"],
    });
  });

  it("Update query params", async () => {
    // Router
    const history = createMemoryHistory({
      initialEntries: [
        "/myurl?name=my%20application1&name=my%20application2&description=my%20description",
      ],
    });

    // Hook
    const { result } = renderHook(() => useQueryString(), {
      wrapper: ({ children }) => <Router history={history}>{children}</Router>,
    });

    expect(result.current[0]).toMatchObject({
      name: ["my application1", "my application2"],
      description: ["my description"],
    });
    expect(history).toMatchObject({
      location: {
        pathname: "/myurl",
        search:
          "?name=my%20application1&name=my%20application2&description=my%20description",
      },
    });

    // Update query params
    act(() => {
      result.current[1]({
        name: ["my name"],
        address: ["my street"],
      });
    });

    expect(result.current[0]).toMatchObject({
      name: ["my name"],
      address: ["my street"],
    });
    expect(history).toMatchObject({
      location: {
        pathname: "/myurl",
        search: "?name=my%20name&address=my%20street",
      },
    });
  });

  it("Default value + update query params", async () => {
    const defaultValue = {
      otherKey: ["other value1", "other value2"],
    };

    // Router
    const history = createMemoryHistory({
      initialEntries: [
        "/myurl?name=my%20application1&name=my%20application2&description=my%20description",
      ],
    });

    // Hook
    const { result } = renderHook(() => useQueryString(defaultValue), {
      wrapper: ({ children }) => <Router history={history}>{children}</Router>,
    });

    expect(result.current[0]).toMatchObject({
      name: ["my application1", "my application2"],
      description: ["my description"],
      otherKey: ["other value1", "other value2"],
    });
    expect(history).toMatchObject({
      location: {
        pathname: "/myurl",
        search:
          "?name=my%20application1&name=my%20application2&description=my%20description",
      },
    });

    // Update query params
    act(() => {
      result.current[1]({
        name: ["my name"],
        address: ["my street"],
      });
    });

    expect(result.current[0]).toMatchObject({
      name: ["my name"],
      address: ["my street"],
      otherKey: ["other value1", "other value2"],
    });
    expect(history).toMatchObject({
      location: {
        pathname: "/myurl",
        search: "?name=my%20name&address=my%20street",
      },
    });
  });
});
