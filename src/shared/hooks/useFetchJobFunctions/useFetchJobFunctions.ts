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
import { useCallback, useReducer } from "react";
import { AxiosError } from "axios";
import { ActionType, createAsyncAction, getType } from "typesafe-actions";

import {
  getJobFunctions,
  JobFunctionSortBy,
  JobFunctionSortByQuery,
} from "api/rest";
import { PageRepresentation, JobFunction, PageQuery } from "api/models";

export const {
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure,
} = createAsyncAction(
  "useFetchJobFunctions/fetch/request",
  "useFetchJobFunctions/fetch/success",
  "useFetchJobFunctions/fetch/failure"
)<void, PageRepresentation<JobFunction>, AxiosError>();

type State = Readonly<{
  isFetching: boolean;
  jobFunctions?: PageRepresentation<JobFunction>;
  fetchError?: AxiosError;
  fetchCount: number;
}>;

const defaultState: State = {
  isFetching: false,
  jobFunctions: undefined,
  fetchError: undefined,
  fetchCount: 0,
};

type Action = ActionType<
  typeof fetchRequest | typeof fetchSuccess | typeof fetchFailure
>;

const initReducer = (isFetching: boolean): State => {
  return {
    ...defaultState,
    isFetching,
  };
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(fetchRequest):
      return {
        ...state,
        isFetching: true,
      };
    case getType(fetchSuccess):
      return {
        ...state,
        isFetching: false,
        fetchError: undefined,
        jobFunctions: action.payload,
        fetchCount: state.fetchCount + 1,
      };
    case getType(fetchFailure):
      return {
        ...state,
        isFetching: false,
        fetchError: action.payload,
        fetchCount: state.fetchCount + 1,
      };
    default:
      return state;
  }
};

export interface IState {
  jobFunctions?: PageRepresentation<JobFunction>;
  isFetching: boolean;
  fetchError?: AxiosError;
  fetchCount: number;
  fetchJobFunctions: (
    filters: {
      role?: string[];
    },
    page: PageQuery,
    sortBy?: JobFunctionSortByQuery
  ) => void;
  fetchAllJobFunctions: () => void;
}

export const useFetchJobFunctions = (
  defaultIsFetching: boolean = false
): IState => {
  const [state, dispatch] = useReducer(reducer, defaultIsFetching, initReducer);

  const fetchJobFunctions = useCallback(
    (
      filters: { role?: string[] },
      page: PageQuery,
      sortBy?: JobFunctionSortByQuery
    ) => {
      dispatch(fetchRequest());

      getJobFunctions(filters, page, sortBy)
        .then(({ data }) => {
          const list = data._embedded["job-function"];
          const total = data.total_count;

          dispatch(
            fetchSuccess({
              data: list,
              meta: {
                count: total,
              },
            })
          );
        })
        .catch((error: AxiosError) => {
          dispatch(fetchFailure(error));
        });
    },
    []
  );

  const fetchAllJobFunctions = useCallback(() => {
    dispatch(fetchRequest());

    getJobFunctions(
      {},
      { page: 1, perPage: 1000 },
      { field: JobFunctionSortBy.ROLE }
    )
      .then(({ data }) => {
        const list = data._embedded["job-function"];
        const total = data.total_count;

        dispatch(
          fetchSuccess({
            data: list,
            meta: {
              count: total,
            },
          })
        );
      })
      .catch((error: AxiosError) => {
        dispatch(fetchFailure(error));
      });
  }, []);

  return {
    jobFunctions: state.jobFunctions,
    isFetching: state.isFetching,
    fetchError: state.fetchError,
    fetchCount: state.fetchCount,
    fetchJobFunctions,
    fetchAllJobFunctions,
  };
};

export default useFetchJobFunctions;
