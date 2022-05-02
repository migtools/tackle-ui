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
import { ActionType, createAction, getType } from "typesafe-actions";
import { IExtraColumnData, SortByDirection } from "@patternfly/react-table";

import { DEFAULT_PAGINATION } from "Constants";
import { PageQuery, SortByQuery } from "api/models";

interface PaginationAction {
  page: number;
  perPage?: number;
}

interface SortAction {
  index: number;
  direction: "asc" | "desc";
}

// Actions

const setPagination = createAction(
  "tableControls/pagination/change"
)<PaginationAction>();

const setSortBy = createAction("tableControls/sortBy/change")<SortAction>();

// State
type State = Readonly<{
  changed: boolean;

  paginationQuery: PageQuery;
  sortByQuery?: SortByQuery;
}>;

const defaultState: State = {
  changed: false,

  paginationQuery: {
    ...DEFAULT_PAGINATION,
  },
  sortByQuery: undefined,
};

// Reducer

type Action = ActionType<typeof setSortBy | typeof setPagination>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(setPagination):
      return {
        ...state,
        changed: true,
        paginationQuery: {
          page: action.payload.page,
          perPage: action.payload.perPage
            ? action.payload.perPage
            : state.paginationQuery.perPage,
        },
      };
    case getType(setSortBy):
      return {
        ...state,
        changed: true,
        sortByQuery: {
          index: action.payload.index,
          direction: action.payload.direction,
        },
      };
    default:
      return state;
  }
};

// Hook

interface HookArgs {
  paginationQuery?: PageQuery;
  sortByQuery?: SortByQuery;
}

interface HookState {
  paginationQuery: PageQuery;
  sortByQuery?: SortByQuery;
  handlePaginationChange: (pagination: PaginationAction) => void;
  handleSortChange: (
    event: React.MouseEvent,
    index: number,
    direction: SortByDirection,
    extraData: IExtraColumnData
  ) => void;
}

export const useTableControls = (args?: HookArgs): HookState => {
  const [state, dispatch] = useReducer(reducer, {
    ...defaultState,
    paginationQuery:
      args && args.paginationQuery
        ? { ...args.paginationQuery }
        : { ...defaultState.paginationQuery },
    sortByQuery:
      args && args.sortByQuery
        ? { ...args.sortByQuery }
        : defaultState.sortByQuery,
  });

  const handlePaginationChange = useCallback((pagination: PaginationAction) => {
    dispatch(
      setPagination({
        ...pagination,
        page: pagination.page >= 1 ? pagination.page : 1,
      })
    );
  }, []);

  const handleSortChange = useCallback(
    (
      event: React.MouseEvent,
      index: number,
      direction: SortByDirection,
      extraData: IExtraColumnData
    ) => {
      dispatch(
        setSortBy({
          index: index,
          direction: direction,
        })
      );
    },
    []
  );

  return {
    paginationQuery: state.paginationQuery,
    sortByQuery: state.sortByQuery,
    handlePaginationChange,
    handleSortChange,
  };
};
