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
import { useFetchStakeholderGroups } from "./useFetchStakeholderGroups";
import { StakeholderGroupPage } from "api/models";
import { STAKEHOLDER_GROUPS } from "api/rest";

describe("useFetchStakeholderGroups", () => {
  it("Fetch error due to no REST API found", async () => {
    // Mock REST API
    new MockAdapter(axios).onGet(STAKEHOLDER_GROUPS).networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchStakeholderGroups()
    );

    const {
      stakeholderGroups: stakeholders,
      isFetching,
      fetchError,
      fetchStakeholderGroups,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(stakeholders).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchStakeholderGroups({}, { page: 2, perPage: 50 }));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.stakeholderGroups).toBeUndefined();
    expect(result.current.fetchError).not.toBeUndefined();
  });

  it("Fetch success", async () => {
    // Mock REST API
    const data: StakeholderGroupPage = {
      _embedded: {
        "stakeholder-group": [],
      },
      total_count: 0,
    };

    new MockAdapter(axios)
      .onGet(`${STAKEHOLDER_GROUPS}?page=0&size=10`)
      .reply(200, data);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchStakeholderGroups()
    );

    const {
      stakeholderGroups: stakeholders,
      isFetching,
      fetchError,
      fetchStakeholderGroups: fetchStakeholders,
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
    expect(result.current.stakeholderGroups).toMatchObject({
      data: [],
      meta: { count: 0 },
    });
    expect(result.current.fetchError).toBeUndefined();
  });

  it("Fetch all", async () => {
    // Mock REST API
    const data: StakeholderGroupPage = {
      _embedded: {
        "stakeholder-group": [],
      },
      total_count: 0,
    };

    new MockAdapter(axios)
      .onGet(`${STAKEHOLDER_GROUPS}?page=0&size=1000&sort=name`)
      .reply(200, data);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useFetchStakeholderGroups()
    );

    const {
      stakeholderGroups,
      isFetching,
      fetchError,
      fetchAllStakeholderGroups,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(stakeholderGroups).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchAllStakeholderGroups());
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.stakeholderGroups).toMatchObject({
      data: [],
      meta: { count: 0 },
    });
    expect(result.current.fetchError).toBeUndefined();
  });
});
