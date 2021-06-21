import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { ToolbarChip } from "@patternfly/react-core";
import {
  breakWord,
  cellWidth,
  ICell,
  IRow,
  TableVariant,
} from "@patternfly/react-table";

import {
  useApplicationToolbarFilter,
  useFetch,
  useTableControls,
  useTableFilter,
} from "shared/hooks";
import {
  AppTableToolbarToggleGroup,
  AppTableWithControls,
  InputTextFilter,
  ToolbarSearchFilter,
} from "shared/components";

import { Application, AssessmentQuestionRisk } from "api/models";
import { getAssessmentIdentifiedRisks } from "api/rest";

import { ApplicationSelectionContext } from "../../application-selection-context";

export enum FilterKey {
  APPLICATION_NAME = "application_name",
}

export interface ITableRowData {
  category: string;
  question: string;
  answer: string;
  applications: Application[];
}

export interface IIdentifiedRisksTableProps {}

export const IdentifiedRisksTable: React.FC<IIdentifiedRisksTableProps> = () => {
  // i18
  const { t } = useTranslation();

  // Context
  const { selectedItems: applications } = useContext(
    ApplicationSelectionContext
  );

  // Toolbar filters data
  const {
    filters: filtersValue,
    isPresent: areFiltersPresent,
    addFilter,
    setFilter,
    clearAllFilters,
  } = useApplicationToolbarFilter();

  // Table data
  const fetchTableData = useCallback(() => {
    if (applications.length > 0) {
      return getAssessmentIdentifiedRisks(applications.map((f) => f.id!)).then(
        ({ data }) => data
      );
    } else {
      return Promise.resolve([]);
    }
  }, [applications]);

  const {
    data: assessmentQuestionRisks,
    isFetching,
    fetchError,
    requestFetch: refreshTable,
  } = useFetch<AssessmentQuestionRisk[]>({
    defaultIsFetching: true,
    onFetchPromise: fetchTableData,
  });

  const tableData: ITableRowData[] = useMemo(() => {
    return (assessmentQuestionRisks || []).map((risk) => ({
      ...risk,
      applications: risk.applications.reduce((prev, current) => {
        const exists = applications.find((f) => f.id === current);
        return exists ? [...prev, exists] : [...prev];
      }, [] as Application[]),
    }));
  }, [assessmentQuestionRisks, applications]);

  useEffect(() => {
    refreshTable();
  }, [applications, refreshTable]);

  // Table pagination
  const {
    paginationQuery: pagination,
    sortByQuery: sortBy,
    handlePaginationChange: onPaginationChange,
    handleSortChange: onSort,
  } = useTableControls({
    paginationQuery: { page: 1, perPage: 50 },
  });

  const compareToByColumn = useCallback(
    (a: ITableRowData, b: ITableRowData, columnIndex?: number) => 0,
    []
  );

  const filterItem = useCallback(
    (item: ITableRowData) => {
      let matchesFilter: boolean = true;

      const applicationNameFiltersText = (
        filtersValue.get(FilterKey.APPLICATION_NAME) || []
      ).map((f) => f.key);
      if (applicationNameFiltersText.length > 0) {
        matchesFilter = applicationNameFiltersText.some((filterText) =>
          item.applications.some(
            (application) =>
              application.name
                .toLowerCase()
                .indexOf(filterText.toLowerCase()) !== -1
          )
        );
      }

      return matchesFilter;
    },
    [filtersValue]
  );

  const { pageItems, filteredItems } = useTableFilter<ITableRowData>({
    items: tableData,
    sortBy,
    compareToByColumn,
    pagination,
    filterItem,
  });

  // Filter components
  const filterOptions = [
    {
      key: FilterKey.APPLICATION_NAME,
      name: t("terms.application"),
      input: (
        <InputTextFilter
          onApplyFilter={(filterText) => {
            addFilter(FilterKey.APPLICATION_NAME, {
              key: filterText,
              node: filterText,
            });
          }}
        />
      ),
    },
  ];

  // Table
  const columns: ICell[] = [
    {
      title: t("terms.category"),
      transforms: [cellWidth(15)],
      cellTransforms: [breakWord],
      cellFormatters: [],
    },
    {
      title: t("terms.question"),
      transforms: [cellWidth(35)],
      cellTransforms: [breakWord],
      cellFormatters: [],
    },
    {
      title: t("terms.answer"),
      transforms: [cellWidth(35)],
      cellTransforms: [breakWord],
      cellFormatters: [],
    },
    {
      title: t("terms.application(s)"),
      transforms: [cellWidth(15)],
      cellTransforms: [breakWord],
      cellFormatters: [],
    },
  ];

  const rows: IRow[] = [];
  pageItems.forEach((item) => {
    rows.push({
      cells: [
        {
          title: item.category,
        },
        {
          title: item.question,
        },
        {
          title: item.answer,
        },
        {
          title: item.applications.map((f) => f.name).join(", "),
        },
      ],
    });
  });

  return (
    <AppTableWithControls
      variant={TableVariant.compact}
      count={filteredItems.length}
      pagination={pagination}
      sortBy={sortBy}
      onPaginationChange={onPaginationChange}
      onSort={onSort}
      cells={columns}
      rows={rows}
      isLoading={isFetching}
      fetchError={fetchError}
      filtersApplied={areFiltersPresent}
      toolbarClearAllFilters={clearAllFilters}
      toolbarToggle={
        <AppTableToolbarToggleGroup
          categories={filterOptions.map((f) => ({
            key: f.key,
            name: f.name,
          }))}
          chips={filtersValue}
          onChange={(key, value) => {
            setFilter(key as FilterKey, value as ToolbarChip[]);
          }}
        >
          <ToolbarSearchFilter filters={filterOptions} />
        </AppTableToolbarToggleGroup>
      }
    />
  );
};
