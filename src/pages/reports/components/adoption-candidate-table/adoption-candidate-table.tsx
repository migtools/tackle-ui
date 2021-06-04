import React from "react";
import { useTranslation } from "react-i18next";

import {
  cellWidth,
  ICell,
  IRow,
  sortable,
  TableText,
  TableVariant,
} from "@patternfly/react-table";

import { useTableControls, useTableFilter } from "shared/hooks";
import {
  AppTableWithControls,
  ConditionalRender,
  NoDataEmptyState,
  ProposedActionLabel,
} from "shared/components";

import { Application } from "api/models";
import { DEFAULT_EFFORTS, Effort, ProposedAction } from "Constants";
import { Label } from "@patternfly/react-core";

export interface IAdoptionCandidateTableProps {
  applications: Application[];
}

export const AdoptionCandidateTable: React.FC<IAdoptionCandidateTableProps> = ({
  applications,
}) => {
  // i18
  const { t } = useTranslation();

  // Filters
  // const {
  //   filters: filtersValue,
  //   isPresent: areFiltersPresent,
  //   setFilter,
  //   clearAllFilters,
  // } = useToolbarFilter<ToolbarChip>();

  // Table
  const compareToByColumn = (
    a: Application,
    b: Application,
    columnIndex?: number
  ) => {
    switch (columnIndex) {
      case 0: // AppName
        return a.name.localeCompare(b.name);
      case 1: // Criticality
        return (
          (a.review?.businessCriticality || 0) -
          (b.review?.businessCriticality || 0)
        );
      case 2: // Priority
        return (a.review?.workPriority || 0) - (b.review?.workPriority || 0);
      case 4: // Effort
        return (
          (DEFAULT_EFFORTS.get(a.review?.effortEstimate as Effort)?.factor ||
            0) -
          (DEFAULT_EFFORTS.get(b.review?.effortEstimate as Effort)?.factor || 0)
        );
      default:
        return 0;
    }
  };

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
    items: applications,
    sortBy,
    compareToByColumn,
    pagination,
    filterItem: (item) => {
      let result: boolean = true;

      return result;
    },
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
      title: t("terms.confidence"),
      transforms: [cellWidth(15)],
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
    rows.push({
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
          title: "",
        },
        {
          title: (
            <TableText wrapModifier="truncate">
              {item.review?.effortEstimate
                ? DEFAULT_EFFORTS.get(item.review.effortEstimate as Effort)
                    ?.label || item.review.effortEstimate
                : ""}
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
                <Label>Not reviewed</Label>
              )}
            </TableText>
          ),
        },
      ],
    });
  });

  return (
    <ConditionalRender
      when={applications.length === 0}
      then={<NoDataEmptyState title="No applications selected" />}
    >
      <AppTableWithControls
        variant={TableVariant.compact}
        count={applications.length}
        pagination={pagination}
        sortBy={sortBy}
        onPaginationChange={onPaginationChange}
        onSort={onSort}
        cells={columns}
        rows={rows}
        isLoading={false}
        filtersApplied={false}
        // toolbarClearAllFilters={clearAllFilters}
        // toolbarToggle={
        //   <AppTableToolbarToggleGroup
        //     categories={filters}
        //     chips={filtersValue}
        //     onChange={(key, value) => {
        //       setFilter(key, value as ToolbarChip[]);
        //     }}
        //   >
        //     <SelectRiskFilter
        //       value={filtersValue.get(FilterKey.RISK)}
        //       onChange={(values) => setFilter(FilterKey.RISK, values)}
        //     />
        //   </AppTableToolbarToggleGroup>
        // }
      />
    </ConditionalRender>
  );
};
