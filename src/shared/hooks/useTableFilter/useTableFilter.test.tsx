import { renderHook } from "@testing-library/react-hooks";
import { PageQuery } from "api/models";

import { useTableFilter } from "./useTableFilter";

describe("useTableFilter", () => {
  it("Pagination", () => {
    const items = [...Array(15)].map((_, index) => index + 1);
    let page: PageQuery = { page: 1, perPage: 10 };

    const { result } = renderHook(() =>
      useTableFilter<number>({
        items: items,
        pagination: page,
        filterItem: () => true,
        compareToByColumn: () => 1,
      })
    );

    // Page1
    expect(result.current.pageItems).toEqual(items.slice(0, 10));
  });

  it("Filter", () => {
    const items = [...Array(15)].map((_, index) => index + 1);
    let page: PageQuery = { page: 1, perPage: 10 };

    const { result } = renderHook(() =>
      useTableFilter<number>({
        items: items,
        pagination: page,
        filterItem: (value) => value % 2 === 1,
        compareToByColumn: () => 1,
      })
    );

    // Page1
    expect(result.current.pageItems).toEqual([1, 3, 5, 7, 9, 11, 13, 15]);
  });

  it("SortBy", () => {
    const items = [...Array(15)].map((_, index) => index + 1);
    let page: PageQuery = { page: 1, perPage: 10 };

    const { result } = renderHook(() =>
      useTableFilter<number>({
        items: items,
        pagination: page,
        filterItem: () => true,
        sortBy: { direction: "desc", index: 7 },
        compareToByColumn: (a, b, columnIndex) => {
          if (columnIndex === 7) {
            return a - b;
          }
          return 0;
        },
      })
    );

    // Page1
    expect(result.current.pageItems).toEqual([
      15,
      14,
      13,
      12,
      11,
      10,
      9,
      8,
      7,
      6,
    ]);
  });
});
