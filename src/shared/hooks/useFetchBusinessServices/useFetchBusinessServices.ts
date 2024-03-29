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
  getBusinessServices,
  BusinessServiceSortByQuery,
  BusinessServiceSortBy,
} from "api/rest";
import { PageRepresentation, BusinessService, PageQuery } from "api/models";

export const {
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure,
} = createAsyncAction(
  "useFetchBusinessServices/fetch/request",
  "useFetchBusinessServices/fetch/success",
  "useFetchBusinessServices/fetch/failure"
)<void, PageRepresentation<BusinessService>, AxiosError>();

type State = Readonly<{
  isFetching: boolean;
  businessServices?: PageRepresentation<BusinessService>;
  fetchError?: AxiosError;
  fetchCount: number;
}>;

const defaultState: State = {
  isFetching: false,
  businessServices: undefined,
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
        businessServices: action.payload,
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
  businessServices?: PageRepresentation<BusinessService>;
  isFetching: boolean;
  fetchError?: AxiosError;
  fetchCount: number;
  fetchBusinessServices: (
    filters: {
      name?: string[];
      description?: string[];
      owner?: string[];
    },
    page: PageQuery,
    sortBy?: BusinessServiceSortByQuery
  ) => void;
  fetchAllBusinessServices: () => void;
}

export const useFetchBusinessServices = (
  defaultIsFetching: boolean = false
): IState => {
  const [state, dispatch] = useReducer(reducer, defaultIsFetching, initReducer);

  const fetchBusinessServices = useCallback(
    (
      filters: { name?: string[]; description?: string[]; owner?: string[] },
      page: PageQuery,
      sortBy?: BusinessServiceSortByQuery
    ) => {
      dispatch(fetchRequest());

      getBusinessServices(filters, page, sortBy)
        .then(({ data }) => {
          const list = data._embedded["business-service"];
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

  const fetchAllBusinessServices = useCallback(() => {
    dispatch(fetchRequest());

    getBusinessServices(
      {},
      { page: 1, perPage: 1000 },
      { field: BusinessServiceSortBy.NAME }
    )
      .then(({ data }) => {
        const list = data._embedded["business-service"];
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
    businessServices: state.businessServices,
    isFetching: state.isFetching,
    fetchError: state.fetchError,
    fetchCount: state.fetchCount,
    fetchBusinessServices,
    fetchAllBusinessServices,
  };
};

export default useFetchBusinessServices;
