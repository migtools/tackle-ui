import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react-hooks";
import { useDeleteStakeholder } from "./useDeleteStakeholder";
import { Stakeholder } from "api/models";
import { STAKEHOLDERS } from "api/rest";

describe("useDeleteStakeholder", () => {
  it("Valid initial status", () => {
    // Use hook
    const { result } = renderHook(() => useDeleteStakeholder());

    const { isDeleting, deleteStakeholder } = result.current;

    expect(isDeleting).toBe(false);
    expect(deleteStakeholder).toBeDefined();
  });

  it("Delete error", async () => {
    const version: Stakeholder = {
      id: 1,
      displayName: "some",
      email: "some@domain.com",
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios)
      .onDelete(`${STAKEHOLDERS}/${version.id}`)
      .networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useDeleteStakeholder()
    );
    const { deleteStakeholder } = result.current;

    // Init delete
    act(() => deleteStakeholder(version, onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(0);
    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });

  it("Delete success", async () => {
    const version: Stakeholder = {
      id: 1,
      displayName: "some",
      email: "some@domain.com",
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios).onDelete(`${STAKEHOLDERS}/${version.id}`).reply(201);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useDeleteStakeholder()
    );
    const { deleteStakeholder } = result.current;

    // Init delete
    act(() => deleteStakeholder(version, onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledTimes(0);
  });
});
