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
import { useFetchApplications } from "./useFetchApplications";
import { ApplicationPage } from "api/models";
import { APPLICATIONS } from "api/rest";

describe("useFetchApplications", () => {
  it("Fetch error due to no REST API found", async () => {
    // Mock REST API
    new MockAdapter(axios).onGet(APPLICATIONS).networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchApplications()
    );

    const {
      applications: items,
      isFetching,
      fetchError,
      fetchApplications: fetchPage,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(items).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchPage({}, { page: 2, perPage: 50 }));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.applications).toBeUndefined();
    expect(result.current.fetchError).not.toBeUndefined();
  });

  it("Fetch success", async () => {
    // Mock REST API
    const data: ApplicationPage = {
      _embedded: {
        application: [],
      },
      total_count: 0,
    };

    new MockAdapter(axios)
      .onGet(`${APPLICATIONS}?page=0&size=10`)
      .reply(200, data);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchApplications()
    );

    const {
      applications: items,
      isFetching,
      fetchError,
      fetchApplications: fetchPage,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(items).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchPage({}, { page: 1, perPage: 10 }));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.applications).toMatchObject({
      data: [],
      meta: { count: 0 },
    });
    expect(result.current.fetchError).toBeUndefined();
  });

  it("Fetch all", async () => {
    // Mock REST API
    const data: ApplicationPage = {
      _embedded: {
        application: [],
      },
      total_count: 0,
    };

    new MockAdapter(axios)
      .onGet(`${APPLICATIONS}?page=0&size=1000&sort=name`)
      .reply(200, data);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchApplications()
    );

    const {
      applications: items,
      isFetching,
      fetchError,
      fetchAllApplications: fetchAll,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(items).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchAll());
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.applications).toMatchObject({
      data: [],
      meta: { count: 0 },
    });
    expect(result.current.fetchError).toBeUndefined();
  });
});
