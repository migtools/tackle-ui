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
  getStakeholders,
  StakeholderSortBy,
  StakeholderSortByQuery,
} from "api/rest";
import { PageRepresentation, Stakeholder, PageQuery } from "api/models";

export const {
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure,
} = createAsyncAction(
  "useFetchStakeholders/fetch/request",
  "useFetchStakeholders/fetch/success",
  "useFetchStakeholders/fetch/failure"
)<void, PageRepresentation<Stakeholder>, AxiosError>();

type State = Readonly<{
  isFetching: boolean;
  stakeholders?: PageRepresentation<Stakeholder>;
  fetchError?: AxiosError;
  fetchCount: number;
}>;

const defaultState: State = {
  isFetching: false,
  stakeholders: undefined,
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
        stakeholders: action.payload,
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
  stakeholders?: PageRepresentation<Stakeholder>;
  isFetching: boolean;
  fetchError?: AxiosError;
  fetchCount: number;
  fetchStakeholders: (
    filters: {
      email?: string[];
      displayName?: string[];
      jobFunction?: string[];
      stakeholderGroup?: string[];
    },
    page: PageQuery,
    sortBy?: StakeholderSortByQuery
  ) => void;
  fetchAllStakeholders: () => void;
}

export const useFetchStakeholders = (
  defaultIsFetching: boolean = false
): IState => {
  const [state, dispatch] = useReducer(reducer, defaultIsFetching, initReducer);

  const fetchStakeholders = useCallback(
    (
      filters: {
        email?: string[];
        displayName?: string[];
        jobFunction?: string[];
        stakeholderGroups?: string[];
      },
      page: PageQuery,
      sortBy?: StakeholderSortByQuery
    ) => {
      dispatch(fetchRequest());

      getStakeholders(filters, page, sortBy)
        .then(({ data }) => {
          const list = data._embedded.stakeholder;
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

  const fetchAllStakeholders = useCallback(() => {
    dispatch(fetchRequest());

    getStakeholders(
      {},
      { page: 1, perPage: 1000 },
      { field: StakeholderSortBy.DISPLAY_NAME }
    )
      .then(({ data }) => {
        const list = data._embedded.stakeholder;
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
    stakeholders: state.stakeholders,
    isFetching: state.isFetching,
    fetchError: state.fetchError,
    fetchCount: state.fetchCount,
    fetchStakeholders,
    fetchAllStakeholders,
  };
};

export default useFetchStakeholders;
