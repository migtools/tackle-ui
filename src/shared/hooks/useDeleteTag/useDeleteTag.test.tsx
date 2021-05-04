import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react-hooks";
import { useDeleteTag } from "./useDeleteTag";
import { Tag } from "api/models";
import { TAGS } from "api/rest";

describe("useDeleteTag", () => {
  it("Valid initial status", () => {
    // Use hook
    const { result } = renderHook(() => useDeleteTag());

    const { isDeleting, deleteTag: deleteEntity } = result.current;

    expect(isDeleting).toBe(false);
    expect(deleteEntity).toBeDefined();
  });

  it("Delete error", async () => {
    const version: Tag = {
      id: 1,
      name: "some",
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios).onDelete(`${TAGS}/${version.id}`).networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useDeleteTag());
    const { deleteTag: deleteEntity } = result.current;

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
    const version: Tag = {
      id: 1,
      name: "some",
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios).onDelete(`${TAGS}/${version.id}`).reply(201);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useDeleteTag());
    const { deleteTag: deleteEntity } = result.current;

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
