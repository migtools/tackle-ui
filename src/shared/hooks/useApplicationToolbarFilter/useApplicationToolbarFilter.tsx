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
import { useEffect } from "react";

import { ToolbarChip } from "@patternfly/react-core";

import { useQueryString, useToolbarFilter } from "shared/hooks";
import { ChipBusinessService, ChipTag } from "shared/containers";

import { ApplicationFilterKey } from "Constants";

export interface IState {
  filters: Map<string, ToolbarChip[]>;
  isPresent: boolean;
  addFilter: (key: string, value: ToolbarChip) => void;
  setFilter: (key: string, value: ToolbarChip[]) => void;
  removeFilter: (key: string, value: ToolbarChip | ToolbarChip[]) => void;
  clearAllFilters: () => void;
}

export const useApplicationToolbarFilter = (): IState => {
  // Router
  const [queryParams, updateParams] = useQueryString();

  // Toolbar filters
  const { filters, ...rest } = useToolbarFilter<ToolbarChip>(() => {
    const initialValue = new Map<ApplicationFilterKey, ToolbarChip[]>();

    Object.keys(queryParams).forEach((key) => {
      const filterKey = key as ApplicationFilterKey;
      switch (filterKey) {
        case ApplicationFilterKey.NAME:
        case ApplicationFilterKey.DESCRIPTION:
          initialValue.set(
            filterKey,
            queryParams[key].map((q) => ({ key: q, node: q }))
          );
          break;
        case ApplicationFilterKey.BUSINESS_SERVICE:
          initialValue.set(
            filterKey,
            queryParams[key].map((elem) => ({
              key: elem,
              node: <ChipBusinessService id={elem} />,
            }))
          );
          break;
        case ApplicationFilterKey.TAG:
          initialValue.set(
            filterKey,
            queryParams[key].map((elem) => ({
              key: elem,
              node: <ChipTag id={elem} />,
            }))
          );
          break;
      }
    });

    return initialValue;
  });

  useEffect(() => {
    const result: Record<string, string[]> = {};
    Array.from(filters.entries()).forEach((entry) => {
      const filterKey = entry[0];
      const filterValue = entry[1];
      result[filterKey] = filterValue.map((f) => f.key);
    });
    updateParams(result);
  }, [filters, updateParams]);

  return {
    filters,
    ...rest,
  };
};

export default useApplicationToolbarFilter;
