import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react-hooks";
import { useDeleteBusinessService } from "./useDeleteBusinessService";
import { BusinessService } from "api/models";
import { BUSINESS_SERVICES } from "api/rest";

describe("useDeleteBusinessService", () => {
  it("Valid initial status", () => {
    // Use hook
    const { result } = renderHook(() => useDeleteBusinessService());

    const { isDeleting, deleteBusinessService } = result.current;

    expect(isDeleting).toBe(false);
    expect(deleteBusinessService).toBeDefined();
  });

  it("Delete error", async () => {
    const version: BusinessService = {
      id: 1,
      name: "any name",
      owner: {
        email: "pedro@domain.com",
        displayName: "Pedro",
      },
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios)
      .onDelete(`${BUSINESS_SERVICES}/${version.id}`)
      .networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useDeleteBusinessService()
    );
    const { deleteBusinessService: deleteBusinessService } = result.current;

    // Init delete
    act(() => deleteBusinessService(version, onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(0);
    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });

  it("Delete success", async () => {
    const version: BusinessService = {
      id: 1,
      name: "any name",
      owner: {
        displayName: "Pedro",
        email: "pedro@domain.com",
      },
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios)
      .onDelete(`${BUSINESS_SERVICES}/${version.id}`)
      .reply(201);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useDeleteBusinessService()
    );
    const { deleteBusinessService } = result.current;

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
