import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react-hooks";
import { useDeleteTagType } from "./useDeleteTagType";
import { TagType } from "api/models";
import { TAG_TYPES } from "api/rest";

describe("useDeleteTagType", () => {
  it("Valid initial status", () => {
    // Use hook
    const { result } = renderHook(() => useDeleteTagType());

    const { isDeleting, deleteTagType: deleteEntity } = result.current;

    expect(isDeleting).toBe(false);
    expect(deleteEntity).toBeDefined();
  });

  it("Delete error", async () => {
    const version: TagType = {
      id: 1,
      name: "some",
      rank: 10,
      colour: "#fff",
      tags: [],
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios)
      .onDelete(`${TAG_TYPES}/${version.id}`)
      .networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useDeleteTagType());
    const { deleteTagType: deleteEntity } = result.current;

    // Init delete
    act(() => deleteEntity(version, onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(0);
    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });

  it("Delete success", async () => {
    const version: TagType = {
      id: 1,
      name: "some",
      rank: 10,
      colour: "#fff",
      tags: [],
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios).onDelete(`${TAG_TYPES}/${version.id}`).reply(201);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useDeleteTagType());
    const { deleteTagType: deleteEntity } = result.current;

    // Init delete
    act(() => deleteEntity(version, onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledTimes(0);
  });
});
