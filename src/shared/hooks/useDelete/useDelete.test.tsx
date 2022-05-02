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

import { Application } from "api/models";
import { deleteApplication, APPLICATIONS } from "api/rest";

import { useDelete } from "./useDelete";

describe("useDelete", () => {
  it("Valid initial status", () => {
    // Use hook
    const { result } = renderHook(() =>
      useDelete<Application>({
        onDelete: jest.fn(),
      })
    );

    const { isDeleting, requestDelete } = result.current;

    expect(isDeleting).toBe(false);
    expect(requestDelete).toBeDefined();
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
    const onDelete = (application: Application) => {
      return deleteApplication(application.id!);
    };

    const { result, waitForNextUpdate } = renderHook(() =>
      useDelete<Application>({ onDelete })
    );
    const { requestDelete } = result.current;

    // Init delete
    act(() => requestDelete(app, onSuccessMock, onErrorMock));
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
    const onDelete = (application: Application) => {
      return deleteApplication(application.id!);
    };

    const { result, waitForNextUpdate } = renderHook(() =>
      useDelete<Application>({ onDelete })
    );
    const { requestDelete: deleteBusinessService } = result.current;

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
