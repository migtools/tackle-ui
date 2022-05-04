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
import { useCallback, useState } from "react";
import { AxiosError } from "axios";

import { createAssessment, getAssessments } from "api/rest";
import { Application, Assessment } from "api/models";

export interface IState {
  inProgress: boolean;
  getCurrentAssessment: (
    application: Application,
    onSuccess: (assessment?: Assessment) => void,
    onError: (error: AxiosError) => void
  ) => void;
  assessApplication: (
    application: Application,
    onSuccess: (assessment: Assessment) => void,
    onError: (error: AxiosError) => void
  ) => void;
}

export const useAssessApplication = (): IState => {
  const [inProgress, setInProgress] = useState(false);

  const getCurrentAssessmentHandler = useCallback(
    (
      application: Application,
      onSuccess: (assessment?: Assessment) => void,
      onError: (error: AxiosError) => void
    ) => {
      if (!application.id) {
        console.log("Entity must have 'id' to execute this operationn");
        return;
      }

      setInProgress(true);
      getAssessments({ applicationId: application.id })
        .then(({ data }) => {
          const currentAssessment: Assessment | undefined = data[0]
            ? data[0]
            : undefined;

          setInProgress(false);
          onSuccess(currentAssessment);
        })
        .catch((error: AxiosError) => {
          setInProgress(false);
          onError(error);
        });
    },
    []
  );

  const assessApplicationHandler = useCallback(
    (
      application: Application,
      onSuccess: (assessment: Assessment) => void,
      onError: (error: AxiosError) => void
    ) => {
      if (!application.id) {
        console.log("Entity must have 'id' to execute this operation");
        return;
      }

      setInProgress(true);
      getAssessments({ applicationId: application.id })
        .then(({ data }) => {
          const currentAssessment: Assessment | undefined = data[0];

          const newAssessment = {
            applicationId: application.id,
          } as Assessment;

          return Promise.all([
            currentAssessment,
            !currentAssessment ? createAssessment(newAssessment) : undefined,
          ]);
        })
        .then(([currentAssessment, newAssessment]) => {
          setInProgress(false);
          onSuccess(currentAssessment || newAssessment!.data);
        })
        .catch((error: AxiosError) => {
          setInProgress(false);
          onError(error);
        });
    },
    []
  );

  return {
    inProgress: inProgress,
    getCurrentAssessment: getCurrentAssessmentHandler,
    assessApplication: assessApplicationHandler,
  };
};

export default useAssessApplication;
