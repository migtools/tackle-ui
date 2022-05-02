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
import { ASSESSMENTS } from "api/rest";

import { useAssessApplication } from "./useAssessApplication";

describe("useAssessApplication", () => {
  it("Initial status", () => {
    const { result } = renderHook(() => useAssessApplication());
    const { inProgress } = result.current;
    expect(inProgress).toBe(false);
  });

  it("getCurrentAssessment: application without ID", async () => {
    const application: Application = {
      name: "some",
    };

    // Use hook
    const { result } = renderHook(() => useAssessApplication());

    // Start call
    const { getCurrentAssessment } = result.current;

    act(() => getCurrentAssessment(application, jest.fn(), jest.fn()));
    expect(result.current.inProgress).toBe(false);
  });

  it("getCurrentAssessment: endpoint fails", async () => {
    const application: Application = {
      id: 1,
      name: "some",
    };

    new MockAdapter(axios)
      .onGet(`${ASSESSMENTS}?applicationId=${application.id}}`)
      .networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useAssessApplication()
    );

    // Start call
    const { getCurrentAssessment } = result.current;

    const onSuccessSpy = jest.fn();
    const onErrorSpy = jest.fn();

    act(() => getCurrentAssessment(application, onSuccessSpy, onErrorSpy));
    expect(result.current.inProgress).toBe(true);

    // Verify next status
    await waitForNextUpdate();
    expect(result.current.inProgress).toBe(false);
    expect(onSuccessSpy).toHaveBeenCalledTimes(0);
    expect(onErrorSpy).toHaveBeenCalledTimes(1);
  });

  it("getCurrentAssessment: endpoints works with empty array response", async () => {
    const application: Application = {
      id: 1,
      name: "some",
    };

    // Mock REST API
    new MockAdapter(axios)
      .onGet(`${ASSESSMENTS}?applicationId=${application.id}`)
      .reply(200, []);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useAssessApplication()
    );

    // Start call
    const { getCurrentAssessment } = result.current;

    const onSuccessSpy = jest.fn();
    const onErrorSpy = jest.fn();

    act(() => getCurrentAssessment(application, onSuccessSpy, onErrorSpy));
    expect(result.current.inProgress).toBe(true);

    // Verify next status
    await waitForNextUpdate();
    expect(result.current.inProgress).toBe(false);
    expect(onSuccessSpy).toHaveBeenCalledTimes(1);
    expect(onSuccessSpy).toHaveBeenCalledWith(undefined);
    expect(onErrorSpy).toHaveBeenCalledTimes(0);
  });

  it("getCurrentAssessment: endpoints works with filled array response", async () => {
    const application: Application = {
      id: 1,
      name: "some",
    };

    const response = { id: 123 };

    new MockAdapter(axios)
      .onGet(`${ASSESSMENTS}?applicationId=${application.id}`)
      .reply(200, [response]);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useAssessApplication()
    );

    // Start call
    const { getCurrentAssessment } = result.current;

    const onSuccessSpy = jest.fn();
    const onErrorSpy = jest.fn();

    act(() => getCurrentAssessment(application, onSuccessSpy, onErrorSpy));
    expect(result.current.inProgress).toBe(true);

    // Verify next status
    await waitForNextUpdate();
    expect(result.current.inProgress).toBe(false);
    expect(onSuccessSpy).toHaveBeenCalledTimes(1);
    expect(onSuccessSpy).toHaveBeenCalledWith(response);
    expect(onErrorSpy).toHaveBeenCalledTimes(0);
  });

  //

  it("assessApplication: application without ID", async () => {
    const application: Application = {
      name: "some",
    };

    // Use hook
    const { result } = renderHook(() => useAssessApplication());

    // Start call
    const { assessApplication } = result.current;

    act(() => assessApplication(application, jest.fn(), jest.fn()));
    expect(result.current.inProgress).toBe(false);
  });

  it("assessApplication: fetchAssessment fails", async () => {
    const application: Application = {
      id: 1,
      name: "some",
    };

    new MockAdapter(axios)
      .onGet(`${ASSESSMENTS}?applicationId=${application.id}}`)
      .networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useAssessApplication()
    );

    // Start call
    const { assessApplication } = result.current;

    const onSuccessSpy = jest.fn();
    const onErrorSpy = jest.fn();

    act(() => assessApplication(application, onSuccessSpy, onErrorSpy));
    expect(result.current.inProgress).toBe(true);

    // Verify next status
    await waitForNextUpdate();
    expect(result.current.inProgress).toBe(false);
    expect(onSuccessSpy).toHaveBeenCalledTimes(0);
    expect(onErrorSpy).toHaveBeenCalledTimes(1);
  });

  it("assessApplication: createAssessment fails", async () => {
    const application: Application = {
      id: 1,
      name: "some",
    };

    new MockAdapter(axios)
      .onGet(`${ASSESSMENTS}?applicationId=${application.id}}`)
      .reply(200, []);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useAssessApplication()
    );

    // Start call
    const { assessApplication } = result.current;

    const onSuccessSpy = jest.fn();
    const onErrorSpy = jest.fn();

    act(() => assessApplication(application, onSuccessSpy, onErrorSpy));
    expect(result.current.inProgress).toBe(true);

    // Verify next status
    await waitForNextUpdate();
    expect(result.current.inProgress).toBe(false);
    expect(onSuccessSpy).toHaveBeenCalledTimes(0);
    expect(onErrorSpy).toHaveBeenCalledTimes(1);
  });

  it("assessApplication: if assessment exists already => don't create a new assessment", async () => {
    const application: Application = {
      id: 1,
      name: "some",
    };

    // Mock REST API
    const assessmentResponse = { id: 123 };
    new MockAdapter(axios)
      .onGet(`${ASSESSMENTS}?applicationId=${application.id}`)
      .reply(200, [assessmentResponse]);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useAssessApplication()
    );

    // Start call
    const { assessApplication } = result.current;

    const onSuccessSpy = jest.fn();
    const onErrorSpy = jest.fn();

    act(() => assessApplication(application, onSuccessSpy, onErrorSpy));
    expect(result.current.inProgress).toBe(true);

    // Verify next status
    await waitForNextUpdate();
    expect(result.current.inProgress).toBe(false);
    expect(onSuccessSpy).toHaveBeenCalledTimes(1);
    expect(onSuccessSpy).toHaveBeenCalledWith(assessmentResponse);
    expect(onErrorSpy).toHaveBeenCalledTimes(0);
  });

  it("assessApplication: if assessment doesn't exists => create a new assessment", async () => {
    const application: Application = {
      id: 1,
      name: "some",
    };

    // Mock REST API
    const assessmentResponse = { id: 123 };
    new MockAdapter(axios)
      .onGet(`${ASSESSMENTS}?applicationId=${application.id}`)
      .reply(200, [])

      .onPost(ASSESSMENTS)
      .reply(200, assessmentResponse);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() =>
      useAssessApplication()
    );

    // Start call
    const { assessApplication } = result.current;

    const onSuccessSpy = jest.fn();
    const onErrorSpy = jest.fn();

    act(() => assessApplication(application, onSuccessSpy, onErrorSpy));
    expect(result.current.inProgress).toBe(true);

    // Verify next status
    await waitForNextUpdate();
    expect(result.current.inProgress).toBe(false);
    expect(onSuccessSpy).toHaveBeenCalledTimes(1);
    expect(onSuccessSpy).toHaveBeenCalledWith(assessmentResponse);
    expect(onErrorSpy).toHaveBeenCalledTimes(0);
  });
});
