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
import { useFetchStakeholders } from "./useFetchStakeholders";
import { StakeholderPage } from "api/models";
import { STAKEHOLDERS } from "api/rest";

describe("useFetchStakeholders", () => {
  it("Fetch error due to no REST API found", async () => {
    // Mock REST API
    new MockAdapter(axios).onGet(STAKEHOLDERS).networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchStakeholders()
    );

    const {
      stakeholders,
      isFetching,
      fetchError,
      fetchStakeholders,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(stakeholders).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchStakeholders({}, { page: 2, perPage: 50 }));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.stakeholders).toBeUndefined();
    expect(result.current.fetchError).not.toBeUndefined();
  });

  it("Fetch success", async () => {
    // Mock REST API
    const data: StakeholderPage = {
      _embedded: {
        stakeholder: [],
      },
      total_count: 0,
    };

    new MockAdapter(axios)
      .onGet(`${STAKEHOLDERS}?page=0&size=10`)
      .reply(200, data);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchStakeholders()
    );

    const {
      stakeholders,
      isFetching,
      fetchError,
      fetchStakeholders,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(stakeholders).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchStakeholders({}, { page: 1, perPage: 10 }));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.stakeholders).toMatchObject({
      data: [],
      meta: { count: 0 },
    });
    expect(result.current.fetchError).toBeUndefined();
  });

  it("Fetch all", async () => {
    // Mock REST API
    const data: StakeholderPage = {
      _embedded: {
        stakeholder: [],
      },
      total_count: 0,
    };

    new MockAdapter(axios)
      .onGet(`${STAKEHOLDERS}?page=0&size=1000&sort=displayName`)
      .reply(200, data);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchStakeholders()
    );

    const {
      stakeholders,
      isFetching,
      fetchError,
      fetchAllStakeholders,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(stakeholders).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchAllStakeholders());
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.stakeholders).toMatchObject({
      data: [],
      meta: { count: 0 },
    });
    expect(result.current.fetchError).toBeUndefined();
  });
});
