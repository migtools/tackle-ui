import { SortByDirection } from "@patternfly/react-table";
import { PageQuery, SortByQuery } from "api/models";

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
  filterItem: filter,
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
    pageItems,
    filteredItems,
  };
};
