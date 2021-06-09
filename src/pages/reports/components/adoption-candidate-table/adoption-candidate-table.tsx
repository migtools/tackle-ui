import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import {
  cellWidth,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  sortable,
  TableText,
  TableVariant,
} from "@patternfly/react-table";
import { Label, ToolbarItem } from "@patternfly/react-core";

import { useTableControls, useTableFilter } from "shared/hooks";
import {
  AppTableWithControls,
  ProposedActionLabel,
  ToolbarBulkSelector,
} from "shared/components";

import { EFFORT_ESTIMATE_LIST } from "Constants";
import { Application } from "api/models";
import { ApplicationSelectionContext } from "pages/reports/application-selection-context";

const compareToByColumn = (
  a: Application,
  b: Application,
  columnIndex?: number
) => {
  switch (columnIndex) {
    case 1: // AppName
      return a.name.localeCompare(b.name);
    case 2: // Criticality
      return (
        (a.review?.businessCriticality || 0) -
        (b.review?.businessCriticality || 0)
      );
    case 3: // Priority
      return (a.review?.workPriority || 0) - (b.review?.workPriority || 0);
    case 4: // Effort
      const aEffortSortFactor = a.review
        ? EFFORT_ESTIMATE_LIST[a.review.effortEstimate]?.sortFactor || 0
        : 0;
      const bEffortSortFactor = b.review
        ? EFFORT_ESTIMATE_LIST[b.review.effortEstimate]?.sortFactor || 0
        : 0;
      return aEffortSortFactor - bEffortSortFactor;
    default:
      return 0;
  }
};

const filterItem = () => true;

const ENTITY_FIELD = "entity";
const getRow = (rowData: IRowData): Application => {
  return rowData[ENTITY_FIELD];
};

export interface IAdoptionCandidateTableProps {}

export const AdoptionCandidateTable: React.FC<IAdoptionCandidateTableProps> = () => {
  // i18
  const { t } = useTranslation();

  // Context
  const {
    allItems: allRows,
    selectedItems: selectedRows,
    areAllSelected: areAllRowsSelected,
    isItemSelected: isRowSelected,
    toggleItemSelected: toggleRowSelected,
    selectAll: selectAllRows,
    setSelectedItems: setSelectedRows,
    selectMultiple: selectMultipleRows,
  } = useContext(ApplicationSelectionContext);

  // Table
  const {
    paginationQuery: pagination,
    sortByQuery: sortBy,
    handlePaginationChange: onPaginationChange,
    handleSortChange: onSort,
  } = useTableControls({
    paginationQuery: { page: 1, perPage: 10 },
    sortByQuery: { direction: "asc", index: 0 },
  });

  const { pageItems } = useTableFilter<Application>({
    items: allRows,
    sortBy,
    compareToByColumn,
    pagination,
    filterItem: filterItem,
  });

  // Table
  const columns: ICell[] = [
    {
      title: t("terms.applicationName"),
      transforms: [sortable, cellWidth(25)],
      cellFormatters: [],
    },
    {
      title: t("terms.criticality"),
      transforms: [sortable, cellWidth(15)],
      cellFormatters: [],
    },
    {
      title: t("terms.priority"),
      transforms: [sortable, cellWidth(15)],
      cellFormatters: [],
    },
    {
      title: t("terms.effort"),
      transforms: [sortable, cellWidth(15)],
      cellFormatters: [],
    },
    {
      title: t("terms.decision"),
      transforms: [cellWidth(15)],
      cellFormatters: [],
    },
  ];

  const rows: IRow[] = [];
  pageItems.forEach((item) => {
    const isSelected = isRowSelected(item);

    rows.push({
      [ENTITY_FIELD]: item,
      selected: isSelected,
      cells: [
        {
          title: <TableText wrapModifier="truncate">{item.name}</TableText>,
        },
        {
          title: (
            <TableText wrapModifier="truncate">
              {item.review?.businessCriticality}
            </TableText>
          ),
        },
        {
          title: (
            <TableText wrapModifier="truncate">
              {item.review?.workPriority}
            </TableText>
          ),
        },
        {
          title: (
            <TableText wrapModifier="truncate">
              {item.review
                ? EFFORT_ESTIMATE_LIST[item.review.effortEstimate]?.label
                : ""}
            </TableText>
          ),
        },
        {
          title: (
            <TableText wrapModifier="truncate">
              {item.review ? (
                <ProposedActionLabel action={item.review.proposedAction} />
              ) : (
                <Label>{t("terms.notReviewed")}</Label>
              )}
            </TableText>
          ),
        },
      ],
    });
  });

  // Row actions
  const selectRow = (
    event: React.FormEvent<HTMLInputElement>,
    isSelected: boolean,
    rowIndex: number,
    rowData: IRowData,
    extraData: IExtraData
  ) => {
    if (rowIndex === -1) {
      isSelected ? selectAllRows() : setSelectedRows([]);
    } else {
      const row = getRow(rowData);
      toggleRowSelected(row);
    }
  };

  return (
    <AppTableWithControls
      variant={TableVariant.compact}
      count={allRows.length}
      pagination={pagination}
      sortBy={sortBy}
      onPaginationChange={onPaginationChange}
      onSort={onSort}
      cells={columns}
      rows={rows}
      onSelect={selectRow}
      canSelectAll={false}
      isLoading={false}
      filtersApplied={false}
      toolbarToggle={
        <>
          <ToolbarItem variant="bulk-select">
            <ToolbarBulkSelector
              areAllRowsSelected={areAllRowsSelected}
              perPage={pagination.perPage}
              totalItems={allRows.length}
              totalSelectedRows={selectedRows.length}
              onSelectAll={selectAllRows}
              onSelectNone={() => setSelectedRows([])}
              onSelectCurrentPage={() => selectMultipleRows(pageItems, true)}
            />
          </ToolbarItem>
        </>
      }
    />
  );
};
