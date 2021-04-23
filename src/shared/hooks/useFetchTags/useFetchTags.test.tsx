import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react-hooks";
import { useFetchTags } from "./useFetchTags";
import { TagPage } from "api/models";
import { TAGS } from "api/rest";

describe("useFetchTags", () => {
  it("Fetch error due to no REST API found", async () => {
    // Mock REST API
    new MockAdapter(axios).onGet(TAGS).networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useFetchTags());

    const {
      tags: businessServices,
      isFetching,
      fetchError,
      fetchTags: fetchItems,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(businessServices).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchItems({}, { page: 2, perPage: 50 }));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.tags).toBeUndefined();
    expect(result.current.fetchError).not.toBeUndefined();
  });

  it("Fetch success", async () => {
    // Mock REST API
    const data: TagPage = {
      _embedded: {
        tag: [],
      },
      total_count: 0,
    };

    new MockAdapter(axios)
      .onGet(`${TAGS}?page=0&size=10&name=something`)
      .reply(200, data);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useFetchTags());

    const {
      tags: businessServices,
      isFetching,
      fetchError,
      fetchTags: fetchItems,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(businessServices).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchItems({ name: ["something"] }, { page: 1, perPage: 10 }));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.tags).toMatchObject({
      data: [],
      meta: { count: 0 },
    });
    expect(result.current.fetchError).toBeUndefined();
  });

  it("Fetch all", async () => {
    // Mock REST API
    const data: TagPage = {
      _embedded: {
        tag: [],
      },
      total_count: 0,
    };

    new MockAdapter(axios)
      .onGet(`${TAGS}?page=0&size=1000&sort=name`)
      .reply(200, data);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useFetchTags());

    const {
      tags: items,
      isFetching,
      fetchError,
      fetchAllTags: fetchAll,
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
    expect(result.current.tags).toMatchObject({
      data: [],
      meta: { count: 0 },
    });
    expect(result.current.fetchError).toBeUndefined();
  });
});
