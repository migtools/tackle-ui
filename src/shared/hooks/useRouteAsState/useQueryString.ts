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
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";

import { encodeValues, objectToQueryParams, removeUndefined } from "./helpers";
import { useDecodedLocation } from "./useDecodedLocation";

type DispatchState<TState> = Dispatch<SetStateAction<TState>>;
type RouteObject = Record<string, string[]>;

export const useQueryString = (
  defaultValues?: RouteObject
): [RouteObject, DispatchState<RouteObject>] => {
  const { pathname, search } = useDecodedLocation();
  const history = useHistory();

  const updateQuery: DispatchState<RouteObject> = useCallback(
    (dispatch: SetStateAction<RouteObject>) => {
      const updatedParams =
        typeof dispatch === "function" ? dispatch(search) : dispatch;
      history.replace(
        pathname + objectToQueryParams(encodeValues(updatedParams))
      );
    },
    [search, pathname, history]
  );

  const queryWithDefault = useMemo(() => {
    return Object.assign({}, defaultValues, removeUndefined(search));
  }, [search, defaultValues]);

  return [queryWithDefault, updateQuery];
};
