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
import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react-hooks";
import { useFetchApplicationDependencies } from "./useFetchApplicationDependencies";
import { ApplicationDependencyPage } from "api/models";
import { APPLICATION_DEPENDENCY } from "api/rest";

describe("useFetchApplicationDependencies", () => {
  it("Fetch all", async () => {
    // Mock REST API
    const data: ApplicationDependencyPage = {
      _embedded: {
        "applications-dependency": [],
      },
      total_count: 0,
    };

    new MockAdapter(axios)
      .onGet(`${APPLICATION_DEPENDENCY}?page=0&size=1000&from.id=1`)
      .reply(200, data);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchApplicationDependencies()
    );

    const {
      applicationDependencies: items,
      isFetching,
      fetchError,
      fetchAllApplicationDependencies: fetchAll,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(items).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchAll({ from: ["1"] }));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.applicationDependencies).toMatchObject({
      data: [],
      meta: { count: 0 },
    });
    expect(result.current.fetchError).toBeUndefined();
  });
});
