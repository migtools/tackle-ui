import { useCallback, useReducer } from "react";
import { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import { ActionType, createAsyncAction, getType } from "typesafe-actions";

interface IFetchData<K = any, T = any> {
  id: K;
  data: T;
}

interface IFetchError<K = any> {
  id: K;
  error: AxiosError;
}

export const {
  request: fetchRequest,
  success: fetchSuccess,
  failure: fetchFailure,
} = createAsyncAction(
  "useMultipleFetch/fetch/request",
  "useMultipleFetch/fetch/success",
  "useMultipleFetch/fetch/failure"
)<any[], IFetchData, IFetchError>();

interface State<K = any, T = any> {
  isFetching: Map<K, boolean>;
  data: Map<K, T>;
  fetchError: Map<K, AxiosError | undefined>;
  fetchCount: Map<K, number>;
}

const defaultState: State = {
  isFetching: new Map(),
  data: new Map(),
  fetchError: new Map(),
  fetchCount: new Map(),
};

type Action = ActionType<
  typeof fetchRequest | typeof fetchSuccess | typeof fetchFailure
>;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case getType(fetchRequest):
      return {
        ...state,
        isFetching: action.payload.reduce((reducer, id) => {
          return reducer.set(id, true);
        }, new Map(state.isFetching)),
      };
    case getType(fetchSuccess):
      return {
        ...state,
        isFetching: new Map(state.isFetching).set(action.payload.id, false),
        fetchError: new Map(state.fetchError).set(action.payload.id, undefined),
        data: new Map(state.data).set(action.payload.id, action.payload.data),
        fetchCount: new Map(state.fetchCount).set(
          action.payload.id,
          (state.fetchCount.get(action.payload.id) || 0) + 1
        ),
      };
    case getType(fetchFailure):
      return {
        ...state,
        isFetching: new Map(state.isFetching).set(action.payload.id, false),
        fetchError: new Map(state.fetchError).set(
          action.payload.id,
          action.payload.error
        ),
        fetchCount: new Map(state.fetchCount).set(
          action.payload.id,
          (state.fetchCount.get(action.payload.id) || 0) + 1
        ),
      };
    default:
      return state;
  }
};

export interface IState<K, T> {
  getData: (id: K) => T | undefined;
  isFetching: (id: K) => boolean;
  fetchError: (id: K) => AxiosError | undefined;
  fetchCount: (id: K) => number;

  triggerFetch: (ids: K[]) => void;
}

export const useMultipleFetch = <K, T>(
  fetchCallback: (id: K) => AxiosPromise<T> | Promise<T>
): IState<K, T> => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  const getData = (id: K) => {
    return state.data.get(id);
  };

  const isFetching = (id: K) => {
    return state.isFetching.get(id) || false;
  };

  const fetchError = (id: K) => {
    return state.fetchError.get(id);
  };

  const fetchCount = (id: K) => {
    return state.fetchCount.get(id) || 0;
  };

  const triggerFetch = useCallback(
    (ids: K[]) => {
      dispatch(fetchRequest(ids));

      ids.forEach((id) => {
        (fetchCallback(id) as any)
          .then((response: AxiosResponse<T> | T) => {
            let data: T;
            if (response && (response as any)["data"]) {
              data = (response as AxiosResponse<T>).data;
            } else {
              data = response as T;
            }

            dispatch(
              fetchSuccess({
                id,
                data,
              })
            );
          })
          .catch((error: any) => {
            dispatch(
              fetchFailure({
                id,
                error,
              })
            );
          });
      });
    },
    [fetchCallback]
  );

  return {
    getData,
    isFetching,
    fetchError,
    fetchCount,
    triggerFetch,
  };
};

export default useMultipleFetch;
