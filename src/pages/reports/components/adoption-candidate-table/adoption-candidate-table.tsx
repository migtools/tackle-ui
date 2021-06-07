import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelectionState } from "@konveyor/lib-ui";

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
import {
  Dropdown,
  DropdownToggle,
  DropdownToggleCheckbox,
  Label,
  ToolbarItem,
} from "@patternfly/react-core";

import { useTableControls, useTableFilter } from "shared/hooks";
import { AppTableWithControls, ProposedActionLabel } from "shared/components";

import { DEFAULT_EFFORTS, Effort, ProposedAction } from "Constants";
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
      return (
        (DEFAULT_EFFORTS.get(a.review?.effortEstimate as Effort)?.factor || 0) -
        (DEFAULT_EFFORTS.get(b.review?.effortEstimate as Effort)?.factor || 0)
      );
    default:
      return 0;
  }
};

const ENTITY_FIELD = "entity";
const getRow = (rowData: IRowData): Application => {
  return rowData[ENTITY_FIELD];
};

export interface IAdoptionCandidateTableProps {
  applications: Application[];
}

export const AdoptionCandidateTable: React.FC<IAdoptionCandidateTableProps> = ({
  applications,
}) => {
  const { setApplications: setCtxSelectedApplications } = useContext(
    ApplicationSelectionContext
  );

  // i18
  const { t } = useTranslation();

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

  const {
    selectedItems: selectedRows,
    areAllSelected: areAllRowsSelected,
    isItemSelected: isRowSelected,
    toggleItemSelected: toggleRowSelected,
    selectAll: selectAllRows,
    setSelectedItems: setSelectedRows,
  } = useSelectionState<Application>({
    items: applications,
    initialSelected: applications,
    isEqual: (a, b) => a.id === b.id,
  });

  const { pageItems: currentPageItems } = useTableFilter<Application>({
    items: applications,
    sortBy,
    compareToByColumn,
    pagination,
    filterItem: () => true,
  });

  // Context selection
  // useEffect(() => {
  //   console.log(selectedRows);
  //   setCtxSelectedApplications(selectedRows);
  // }, [selectedRows]);

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
  currentPageItems.forEach((item) => {
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
              {item.review &&
                (DEFAULT_EFFORTS.get(item.review.effortEstimate as Effort)
                  ?.label ||
                  item.review.effortEstimate)}
            </TableText>
          ),
        },
        {
          title: (
            <TableText wrapModifier="truncate">
              {item.review ? (
                <ProposedActionLabel
                  action={item.review.proposedAction as ProposedAction}
                />
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
      count={applications.length}
      pagination={pagination}
      sortBy={sortBy}
      onPaginationChange={onPaginationChange}
      onSort={onSort}
      cells={columns}
      rows={rows}
      onSelect={selectRow}
      canSelectAll={true}
      isLoading={false}
      filtersApplied={false}
      toolbarToggle={
        <>
          <ToolbarItem variant="bulk-select">
            <Dropdown
              toggle={
                <DropdownToggle
                  splitButtonItems={[
                    <DropdownToggleCheckbox
                      id="toolbar-bulk-select"
                      key="toolbar-bulk-select"
                      aria-label="Select all"
                      isDisabled
                      isChecked={
                        areAllRowsSelected
                          ? true
                          : selectedRows.length === 0
                          ? false
                          : null
                      }
                      // onChange={(checked) => {}}
                    >
                      {selectedRows.length} selected
                    </DropdownToggleCheckbox>,
                  ]}
                  onToggle={() => {}}
                />
              }
              isOpen={false}
              dropdownItems={[]}
            />
          </ToolbarItem>
        </>
      }
    />
  );
};
