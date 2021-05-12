import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Label, ToolbarChip } from "@patternfly/react-core";
import {
  cellWidth,
  ICell,
  IRow,
  sortable,
  TableText,
} from "@patternfly/react-table";

import {
  AppTableToolbarToggleGroup,
  AppTableWithControls,
} from "shared/components";
import { useFilter, useTableControls, useTableFilter } from "shared/hooks";

import { Assessment, Risk } from "api/models";

import { SelectRiskFilter } from "./components/select-risk-filter";
import { DEFAULT_RISK_LABELS } from "Constants";

enum FilterKey {
  RISK = "risk",
}

interface ITableItem {
  questionValue: string;
  answerValue?: string;
  riskValue: Risk;
}

export interface IApplicationAssessmentSummaryTableProps {
  assessment: Assessment;
}

export const ApplicationAssessmentSummaryTable: React.FC<IApplicationAssessmentSummaryTableProps> = ({
  assessment,
}) => {
  const { t } = useTranslation();

  // Filters

  const filters = [
    {
      key: FilterKey.RISK,
      name: t("terms.risk"),
    },
  ];

  const {
    filters: filtersValue,
    filtersApplied,
    setFilter,
    removeFilter,
    clearAllFilters,
  } = useFilter<ToolbarChip>();

  // Table

  const tableItems: ITableItem[] = useMemo(() => {
    return assessment.questionnaire.categories
      .slice(0)
      .sort((a, b) => a.order - b.order)
      .flatMap((f) => f.questions)
      .map((f) => {
        return {
          questionValue: f.question,
          answerValue: f.options.find((q) => q.checked === true)?.option,
          riskValue: f.options.find((q) => q.checked === true)?.risk,
        } as ITableItem;
      });
  }, [assessment]);

  const compareToByColumn = (
    a: ITableItem,
    b: ITableItem,
    columnIndex?: number
  ) => {
    const aData = DEFAULT_RISK_LABELS.get(a.riskValue);
    const bData = DEFAULT_RISK_LABELS.get(b.riskValue);

    switch (columnIndex) {
      case 2: // Risk
        return (aData?.order || 0) - (bData?.order || 0);
      default:
        return 0;
    }
  };

  const {
    paginationQuery: pagination,
    sortByQuery: sortBy,
    handlePaginationChange: onPaginationChange,
    handleSortChange: onSort,
  } = useTableControls();

  const { pageItems, filteredItems } = useTableFilter<ITableItem>({
    items: tableItems,
    sortBy,
    compareToByColumn,
    pagination,
    filterItem: (item) => {
      let result: boolean = true;

      const risks = filtersValue.get(FilterKey.RISK)?.map((f) => f.key);
      if (risks && risks.length > 0) {
        result = risks.some((f) => f === item.riskValue);
      }

      return result;
    },
  });

  const columns: ICell[] = [
    {
      title: t("terms.question"),
      transforms: [cellWidth(45)],
      cellFormatters: [],
    },
    {
      title: t("terms.answer"),
      transforms: [cellWidth(45)],
      cellFormatters: [],
    },
    {
      title: t("terms.risk"),
      transforms: [cellWidth(10), sortable],
      cellFormatters: [],
    },
  ];

  const rows: IRow[] = [];
  pageItems.forEach((item) => {
    let riskLabel = <Label color="green">Green</Label>;
    if (item.riskValue === "GREEN") {
      riskLabel = <Label color="green">Green</Label>;
    } else if (item.riskValue === "AMBER") {
      riskLabel = <Label color="orange">Amber</Label>;
    } else if (item.riskValue === "RED") {
      riskLabel = <Label color="red">Red</Label>;
    } else {
      riskLabel = <Label color="grey">Unknown</Label>;
    }

    rows.push({
      cells: [
        {
          title: (
            <TableText wrapModifier="truncate">{item.questionValue}</TableText>
          ),
        },
        {
          title: (
            <TableText wrapModifier="truncate">{item.answerValue}</TableText>
          ),
        },
        {
          title: riskLabel,
        },
      ],
    });
  });

  //

  return (
    <AppTableWithControls
      count={filteredItems.length}
      pagination={pagination}
      sortBy={sortBy}
      onPaginationChange={onPaginationChange}
      onSort={onSort}
      cells={columns}
      rows={rows}
      isLoading={false}
      filtersApplied={filtersApplied}
      toolbarClearAllFilters={clearAllFilters}
      toolbarToggle={
        <AppTableToolbarToggleGroup
          options={filters}
          filtersValue={filtersValue}
          onDeleteFilter={removeFilter}
        >
          <SelectRiskFilter
            value={filtersValue.get(FilterKey.RISK)}
            onChange={(values) => setFilter(FilterKey.RISK, values)}
          />
        </AppTableToolbarToggleGroup>
      }
    />
  );
};
