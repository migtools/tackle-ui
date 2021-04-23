import { useCallback, useReducer } from "react";
import { AxiosError } from "axios";
import { ActionType, createAsyncAction, getType } from "typesafe-actions";

import { getTags, TagSortByQuery, TagSortBy } from "api/rest";
import { PageRepresentation, Tag, PageQuery } from "api/models";

export const {
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure,
} = createAsyncAction(
  "useFetchTags/fetch/request",
  "useFetchTags/fetch/success",
  "useFetchTags/fetch/failure"
)<void, PageRepresentation<Tag>, AxiosError>();

type State = Readonly<{
  isFetching: boolean;
  tags?: PageRepresentation<Tag>;
  fetchError?: AxiosError;
  fetchCount: number;
}>;

const defaultState: State = {
  isFetching: false,
  tags: undefined,
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
        tags: action.payload,
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
  tags?: PageRepresentation<Tag>;
  isFetching: boolean;
  fetchError?: AxiosError;
  fetchCount: number;
  fetchTags: (
    filters: {
      name?: string[];
    },
    page: PageQuery,
    sortBy?: TagSortByQuery
  ) => void;
  fetchAllTags: () => void;
}

export const useFetchTags = (defaultIsFetching: boolean = false): IState => {
  const [state, dispatch] = useReducer(reducer, defaultIsFetching, initReducer);

  const fetchTags = useCallback(
    (
      filters: { name?: string[] },
      page: PageQuery,
      sortBy?: TagSortByQuery
    ) => {
      dispatch(fetchRequest());

      getTags(filters, page, sortBy)
        .then(({ data }) => {
          const list = data._embedded.tag;
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

  const fetchAllTags = useCallback(() => {
    dispatch(fetchRequest());

    getTags({}, { page: 1, perPage: 1000 }, { field: TagSortBy.NAME })
      .then(({ data }) => {
        const list = data._embedded.tag;
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
    tags: state.tags,
    isFetching: state.isFetching,
    fetchError: state.fetchError,
    fetchCount: state.fetchCount,
    fetchTags: fetchTags,
    fetchAllTags: fetchAllTags,
  };
};

export default useFetchTags;
