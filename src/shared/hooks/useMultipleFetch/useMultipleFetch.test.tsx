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
import { useMultipleFetch } from "./useMultipleFetch";

describe("useMultipleFetch", () => {
  const endpointURL = (id: number) => {
    return `/myendpoint/${id}`;
  };

  const searchPromise = (id: number) => {
    return axios.get<string>(endpointURL(id)).then(({ data }) => data);
  };

  const searchAxiosPromise = (id: number) => {
    return axios.get<string>(endpointURL(id));
  };

  it("Fetch error due to no REST API found", async () => {
    const id = 1;
    new MockAdapter(axios).onGet(endpointURL(id)).networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useMultipleFetch<number, string>({ onFetchPromise: searchPromise })
    );

    const {
      getData,
      isFetching,
      fetchError,
      fetchCount,
      triggerFetch,
    } = result.current;

    expect(getData(id)).toBeUndefined();
    expect(isFetching(id)).toBe(false);
    expect(fetchError(id)).toBeUndefined();
    expect(fetchCount(id)).toBe(0);

    // Init fetch
    act(() => triggerFetch([id]));
    expect(result.current.isFetching(id)).toBe(true);
    expect(result.current.fetchCount(id)).toBe(1);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.getData(id)).toBeUndefined();
    expect(result.current.isFetching(id)).toBe(false);
    expect(result.current.fetchError(id)).not.toBeUndefined();
    expect(result.current.fetchCount(id)).toBe(1);
  });

  it("Fetch success using promises", async () => {
    const id = 1;
    new MockAdapter(axios)
      .onGet(endpointURL(id))
      .reply(200, "my response body");

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useMultipleFetch<number, string>({ onFetchPromise: searchPromise })
    );

    const {
      getData,
      isFetching,
      fetchError,
      fetchCount,
      triggerFetch,
    } = result.current;

    expect(getData(id)).toBeUndefined();
    expect(isFetching(id)).toBe(false);
    expect(fetchError(id)).toBeUndefined();
    expect(fetchCount(id)).toBe(0);

    // Init fetch
    act(() => triggerFetch([id]));
    expect(result.current.isFetching(id)).toBe(true);
    expect(result.current.fetchCount(id)).toBe(1);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.getData(id)).toBe("my response body");
    expect(result.current.isFetching(id)).toBe(false);
    expect(result.current.fetchError(id)).toBeUndefined();
    expect(result.current.fetchCount(id)).toBe(1);
  });

  it("Fetch success using AxiosPromise", async () => {
    const id = 1;
    new MockAdapter(axios)
      .onGet(endpointURL(id))
      .reply(200, "my response body");

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useMultipleFetch<number, string>({ onFetch: searchAxiosPromise })
    );

    const {
      getData,
      isFetching,
      fetchError,
      fetchCount,
      triggerFetch,
    } = result.current;

    expect(getData(id)).toBeUndefined();
    expect(isFetching(id)).toBe(false);
    expect(fetchError(id)).toBeUndefined();
    expect(fetchCount(id)).toBe(0);

    // Init fetch
    act(() => triggerFetch([id]));
    expect(result.current.isFetching(id)).toBe(true);
    expect(result.current.fetchCount(id)).toBe(1);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.getData(id)).toBe("my response body");
    expect(result.current.isFetching(id)).toBe(false);
    expect(result.current.fetchError(id)).toBeUndefined();
    expect(result.current.fetchCount(id)).toBe(1);
  });
});
