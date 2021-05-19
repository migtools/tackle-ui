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
    const expectedResult = [1, 3, 5, 7, 9, 11, 13, 15];
    expect(result.current.pageItems).toEqual(expectedResult);
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
    const expectedResult = [15, 14, 13, 12, 11, 10, 9, 8, 7, 6];
    expect(result.current.pageItems).toEqual(expectedResult);
  });

  it("SortBy using isEqual", () => {
    const items = [...Array(15)].map((_, index) => index + 1);
    let page: PageQuery = { page: 1, perPage: 10 };

    const expectedResult = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Verify asc
    const { result: resultAsc } = renderHook(() =>
      useTableFilter<number>({
        items: items,
        pagination: page,
        filterItem: () => true,
        sortBy: { direction: "asc", index: 7 },
        compareToByColumn: () => 0, // forcing comparison true
        isEqual: (a, b) => a === b,
      })
    );

    expect(resultAsc.current.pageItems).toEqual(expectedResult);

    // Verify desc
    const { result: resultDesc } = renderHook(() =>
      useTableFilter<number>({
        items: items,
        pagination: page,
        filterItem: () => true,
        sortBy: { direction: "desc", index: 7 },
        compareToByColumn: () => 0, // forcing comparison true
        isEqual: (a, b) => a === b,
      })
    );

    expect(resultDesc.current.pageItems).toEqual(expectedResult);
  });
});
