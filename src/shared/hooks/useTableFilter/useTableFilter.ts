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
import { SortByDirection } from "@patternfly/react-table";
import { PageQuery, SortByQuery } from "api/models";
import { useMemo } from "react";

// Hook

interface HookArgs<T> {
  items?: T[];

  sortBy?: SortByQuery;
  compareToByColumn: (a: T, b: T, columnIndex?: number) => number;

  pagination: PageQuery;
  filterItem: (value: T) => boolean;
}

interface HookState<T> {
  pageItems: T[];
  filteredItems: T[];
}

export const useTableFilter = <T>({
  items,
  sortBy,
  pagination,
  filterItem,
  compareToByColumn,
}: HookArgs<T>): HookState<T> => {
  const state: HookState<T> = useMemo(() => {
    const allItems = [...(items || [])];

    // Filter
    const filteredItems = allItems.filter(filterItem);

    //  Sort
    let orderChanged = false;

    let sortedItems: T[];
    sortedItems = [...filteredItems].sort((a, b) => {
      const comparisonResult = compareToByColumn(a, b, sortBy?.index);
      if (comparisonResult !== 0) {
        orderChanged = true;
      }
      return comparisonResult;
    });

    if (orderChanged && sortBy?.direction === SortByDirection.desc) {
      sortedItems = sortedItems.reverse();
    }

    // Paginate
    const pageItems = sortedItems.slice(
      (pagination.page - 1) * pagination.perPage,
      pagination.page * pagination.perPage
    );

    return {
      pageItems,
      filteredItems,
    };
  }, [items, pagination, sortBy, compareToByColumn, filterItem]);

  return state;
};
