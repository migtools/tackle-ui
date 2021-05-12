import { useState } from "react";
import { ToolbarChip } from "@patternfly/react-core";

// Hook

type FilterValue = string | ToolbarChip;

const getFilterValueKey = (value: FilterValue) => {
  return typeof value === "string" ? value : value.key;
};

interface HookState {
  filters: Map<string, FilterValue[]>;
  filtersApplied: boolean;
  addFilter: (key: string, value: FilterValue) => void;
  setFilter: (key: string, value: FilterValue[]) => void;
  removeFilter: (key: string, value: FilterValue | FilterValue[]) => void;
  clearAllFilters: () => void;
}

export const useFilter = (): HookState => {
  const [filters, setFilters] = useState<Map<string, FilterValue[]>>(
    new Map([])
  );

  const filtersApplied =
    Array.from(filters.values()).reduce(
      (previous, current) => [...previous, ...current],
      []
    ).length > 0;

  const addFilter = (key: string, value: FilterValue) => {
    setFilters((current) => {
      const currentChips = current.get(key) || [];
      return new Map(current).set(key, [...currentChips, value]);
    });
  };

  const setFilter = (key: string, value: FilterValue[]) => {
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
        const fkey = getFilterValueKey(f);
        return !elementsToBeRemoved.some((r) => {
          const rKey = getFilterValueKey(r);
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
