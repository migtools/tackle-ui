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
import { useState } from "react";
import { ToolbarChip } from "@patternfly/react-core";
import { getToolbarChipKey } from "utils/utils";

// Hook

type FilterType = string | ToolbarChip;

interface HookState<T> {
  filters: Map<string, T[]>;
  isPresent: boolean;
  addFilter: (key: string, value: T) => void;
  setFilter: (key: string, value: T[]) => void;
  removeFilter: (key: string, value: FilterType | FilterType[]) => void;
  clearAllFilters: () => void;
}

export const useToolbarFilter = <T extends FilterType>(
  initialValue: Map<string, T[]> | (() => Map<string, T[]>) = new Map()
): HookState<T> => {
  const [filters, setFilters] = useState<Map<string, T[]>>(initialValue);

  const isPresent =
    Array.from(filters.values()).reduce(
      (previous, current) => [...previous, ...current],
      []
    ).length > 0;

  const addFilter = (key: string, value: T) => {
    setFilters((current) => {
      const currentChips = current.get(key) || [];
      return new Map(current).set(key, [...currentChips, value]);
    });
  };

  const setFilter = (key: string, value: T[]) => {
    setFilters((current) => new Map(current).set(key, value));
  };

  const removeFilter = (key: string, value: FilterType | FilterType[]) => {
    setFilters((current) => {
      let elementsToBeRemoved: FilterType[];
      if (Array.isArray(value)) {
        elementsToBeRemoved = [...value];
      } else {
        elementsToBeRemoved = [value];
      }

      const newValue = (current.get(key) || []).filter((f) => {
        const fkey = getToolbarChipKey(f);
        return !elementsToBeRemoved.some((r) => {
          const rKey = getToolbarChipKey(r);
          return fkey === rKey;
        });
      });

      return new Map(current).set(key, newValue);
    });
  };

  const clearAllFilters = () => {
    setFilters((current) => {
      const newVal = new Map(current);
      Array.from(newVal.keys()).forEach((key) => {
        newVal.set(key, []);
      });
      return newVal;
    });
  };

  return {
    filters,
    isPresent,
    addFilter,
    setFilter,
    removeFilter,
    clearAllFilters,
  };
};
