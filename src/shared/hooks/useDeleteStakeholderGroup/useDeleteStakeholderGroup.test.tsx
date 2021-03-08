import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react-hooks";
import { useDeleteStakeholderGroup } from "./useDeleteStakeholderGroup";
import { StakeholderGroup } from "api/models";
import { STAKEHOLDER_GROUPS } from "api/rest";

describe("useDeleteStakeholderGroup", () => {
  it("Valid initial status", () => {
    // Use hook
    const { result } = renderHook(() => useDeleteStakeholderGroup());

    const { isDeleting, deleteStakeholderGroup } = result.current;

    expect(isDeleting).toBe(false);
    expect(deleteStakeholderGroup).toBeDefined();
  });

  it("Delete error", async () => {
    const version: StakeholderGroup = {
      id: 1,
      name: "some",
      description: "my description",
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios)
      .onDelete(`${STAKEHOLDER_GROUPS}/${version.id}`)
      .networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useDeleteStakeholderGroup()
    );
    const { deleteStakeholderGroup } = result.current;

    // Init delete
    act(() => deleteStakeholderGroup(version, onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(0);
    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });

  it("Delete success", async () => {
    const version: StakeholderGroup = {
      id: 1,
      name: "some",
      description: "my description",
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios)
      .onDelete(`${STAKEHOLDER_GROUPS}/${version.id}`)
      .reply(201);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useDeleteStakeholderGroup()
    );
    const { deleteStakeholderGroup } = result.current;

    // Init delete
    act(() => deleteStakeholderGroup(version, onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledTimes(0);
  });
});
