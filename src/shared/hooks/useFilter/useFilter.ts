import { useState } from "react";
import { ToolbarChip } from "@patternfly/react-core";
import { getToolbarChipKey } from "utils/utils";

// Hook

type FilterValue = string | ToolbarChip;

interface HookState<T> {
  filters: Map<string, T[]>;
  filtersApplied: boolean;
  addFilter: (key: string, value: T) => void;
  setFilter: (key: string, value: T[]) => void;
  removeFilter: (key: string, value: FilterValue | FilterValue[]) => void;
  clearAllFilters: () => void;
}

export const useFilter = <T extends FilterValue>(): HookState<T> => {
  const [filters, setFilters] = useState<Map<string, T[]>>(new Map([]));

  const filtersApplied =
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

  const removeFilter = (key: string, value: FilterValue | FilterValue[]) => {
    setFilters((current) => {
      let elementsToBeRemoved: FilterValue[];
      if (Array.isArray(value)) {
        elementsToBeRemoved = [...value];
      } else {
        elementsToBeRemoved = [value];
      }

      const newValue = (current.get(key) || []).filter((f) => {
        const fkey = getToolbarChipKey(f);
        return elementsToBeRemoved.some((r) => {
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
    filtersApplied,
    addFilter,
    setFilter,
    removeFilter,
    clearAllFilters,
  };
};
