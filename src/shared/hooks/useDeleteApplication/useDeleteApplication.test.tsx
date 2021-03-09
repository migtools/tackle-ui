import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react-hooks";
import { useDeleteApplication } from "./useDeleteApplication";
import { Application } from "api/models";
import { APPLICATIONS } from "api/rest";

describe("useDeleteApplication", () => {
  it("Valid initial status", () => {
    // Use hook
    const { result } = renderHook(() => useDeleteApplication());

    const { isDeleting, deleteApplication } = result.current;

    expect(isDeleting).toBe(false);
    expect(deleteApplication).toBeDefined();
  });

  it("Delete error", async () => {
    const app: Application = {
      id: 1,
      name: "any name",
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios).onDelete(`${APPLICATIONS}/${app.id}`).networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useDeleteApplication()
    );
    const { deleteApplication: deleteBusinessService } = result.current;

    // Init delete
    act(() => deleteBusinessService(app, onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(0);
    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });

  it("Delete success", async () => {
    const version: Application = {
      id: 1,
      name: "any name",
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios).onDelete(`${APPLICATIONS}/${version.id}`).reply(201);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useDeleteApplication()
    );
    const { deleteApplication: deleteBusinessService } = result.current;

    // Init delete
    act(() => deleteBusinessService(version, onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledTimes(0);
  });
});
