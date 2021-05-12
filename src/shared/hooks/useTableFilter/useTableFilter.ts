import { useCallback, useMemo, useReducer } from "react";
import { ActionType, createAction, getType } from "typesafe-actions";
import {
  IExtraColumnData,
  ISortBy,
  SortByDirection,
} from "@patternfly/react-table";

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

interface HookArgs<T> {
  items?: T[];

  sortBy?: ISortBy;
  compareToByColumn: (a: T, b: T, columnIndex?: number) => number;

  pagination: { page: number; perPage: number };
  filter: (value: T) => boolean;
}

interface HookState<T> {
  filteredItems: T[];
  pageItems: T[];
}

export const useTableFilter = <T>({
  items,
  sortBy,
  pagination,
  filter,
  compareToByColumn: compareTo,
}: HookArgs<T>): HookState<T> => {
  //  Sort
  let sortedItems: T[];
  sortedItems = [...(items || [])].sort((a, b) =>
    compareTo(a, b, sortBy?.index)
  );
  if (sortBy?.direction === SortByDirection.desc) {
    sortedItems = sortedItems.reverse();
  }

  // Filter
  const filteredItems = sortedItems.filter(filter);

  // Paginate
  const pageItems = filteredItems.slice(
    (pagination.page - 1) * pagination.perPage,
    pagination.page * pagination.perPage
  );

  return {
    filteredItems,
    pageItems,
  };
};
