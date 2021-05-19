import { SortByDirection } from "@patternfly/react-table";
import { PageQuery, SortByQuery } from "api/models";

// Hook

interface HookArgs<T> {
  items?: T[];

  sortBy?: SortByQuery;
  compareToByColumn: (a: T, b: T, columnIndex?: number) => number;

  pagination: PageQuery;
  filterItem: (value: T) => boolean;

  /**
   * Use this field if you want to verify the 'items' changed
   * after sorting and if so then skip reversing 'items'.
   */
  isEqual?: (a: T, b: T) => boolean;
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
  isEqual,
}: HookArgs<T>): HookState<T> => {
  const unsortedItems = [...(items || [])];

  //  Sort
  let sortedItems: T[];
  sortedItems = unsortedItems.sort((a, b) =>
    compareToByColumn(a, b, sortBy?.index)
  );

  let orderChanged: boolean = false;
  if (isEqual) {
    for (let i = 0; i < unsortedItems.length; i++) {
      const unsortedElement = unsortedItems[i];
      const sortedElement = sortedItems[i];
      if (!isEqual(unsortedElement, sortedElement)) {
        orderChanged = true;
        break;
      }
    }
  }

  const shouldReverse = isEqual
    ? orderChanged
    : sortBy?.direction === SortByDirection.desc;
  if (shouldReverse) {
    sortedItems = sortedItems.reverse();
  }

  // Filter
  const filteredItems = sortedItems.filter(filterItem);

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
