import React, { useEffect, useState } from "react";
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
import { AppTableWithControls } from "shared/components";

import { Application, AssessmentQuestionRisk } from "api/models";
import { getAssessmentIdentifiedRisks } from "api/rest";

export interface IIdentifiedRisksTableProps {
  applications: Application[];
}

export const IdentifiedRisksTable: React.FC<IIdentifiedRisksTableProps> = ({
  applications,
}) => {
  // i18
  const { t } = useTranslation();

  //
  const [tableData, setTableData] = useState<AssessmentQuestionRisk[]>([]);

  useEffect(() => {
    if (applications.length > 0) {
      getAssessmentIdentifiedRisks(
        applications.map((f) => f.id!)
      ).then(({ data }) => setTableData(data));
    } else {
      setTableData([]);
    }
  }, [applications]);

  // Filters
  // const {
  //   filters: filtersValue,
  //   isPresent: areFiltersPresent,
  //   setFilter,
  //   clearAllFilters,
  // } = useToolbarFilter<ToolbarChip>();

  // Table
  const compareToByColumn = (
    a: AssessmentQuestionRisk,
    b: AssessmentQuestionRisk,
    columnIndex?: number
  ) => {
    return 0;
  };

  const {
    paginationQuery: pagination,
    sortByQuery: sortBy,
    handlePaginationChange: onPaginationChange,
    handleSortChange: onSort,
  } = useTableControls({
    paginationQuery: { page: 1, perPage: 50 },
  });

  const {
    filteredItems: currentPageItems,
  } = useTableFilter<AssessmentQuestionRisk>({
    items: tableData,
    sortBy,
    compareToByColumn,
    pagination,
    filterItem: (item) => {
      return true;
    },
  });

  // Table
  const columns: ICell[] = [
    {
      title: t("terms.category"),
      transforms: [sortable, cellWidth(15)],
      cellFormatters: [],
    },
    {
      title: t("terms.question"),
      transforms: [sortable, cellWidth(35)],
      cellFormatters: [],
    },
    {
      title: t("terms.answer"),
      transforms: [sortable, cellWidth(35)],
      cellFormatters: [],
    },
    {
      title: t("terms.application(s)"),
      transforms: [sortable, cellWidth(15)],
      cellFormatters: [],
    },
  ];

  const rows: IRow[] = [];
  currentPageItems.forEach((item) => {
    rows.push({
      cells: [
        {
          title: <TableText wrapModifier="truncate">{item.category}</TableText>,
        },
        {
          title: <TableText wrapModifier="truncate">{item.question}</TableText>,
        },
        {
          title: <TableText wrapModifier="truncate">{item.answer}</TableText>,
        },
        {
          title: (
            <TableText wrapModifier="truncate">
              {item.applications.join(", ")}
            </TableText>
          ),
        },
      ],
    });
  });

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
  );
};
