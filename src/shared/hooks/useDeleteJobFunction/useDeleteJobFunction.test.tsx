import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react-hooks";
import { useDeleteJobFunction } from "./useDeleteJobFunction";
import { JobFunction } from "api/models";
import { JOB_FUNCTIONS } from "api/rest";

describe("useDeleteTag", () => {
  it("Valid initial status", () => {
    // Use hook
    const { result } = renderHook(() => useDeleteJobFunction());

    const { isDeleting, deleteJobFunction: deleteEntity } = result.current;

    expect(isDeleting).toBe(false);
    expect(deleteEntity).toBeDefined();
  });

  it("Delete error", async () => {
    const entity: JobFunction = {
      id: 1,
      role: "some",
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios)
      .onDelete(`${JOB_FUNCTIONS}/${entity.id}`)
      .networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useDeleteJobFunction()
    );
    const { deleteJobFunction: deleteEntity } = result.current;

    // Init delete
    act(() => deleteEntity(entity, onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(0);
    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });

  it("Delete success", async () => {
    const entity: JobFunction = {
      id: 1,
      role: "some",
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios).onDelete(`${JOB_FUNCTIONS}/${entity.id}`).reply(201);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useDeleteJobFunction()
    );
    const { deleteJobFunction: deleteEntity } = result.current;

    // Init delete
    act(() => deleteEntity(entity, onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledTimes(0);
  });
});
