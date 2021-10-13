import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  cellWidth,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  sortable,
  truncate,
} from "@patternfly/react-table";
import {
  ActionGroup,
  Button,
  ButtonVariant,
  ToolbarChip,
  ToolbarItem,
} from "@patternfly/react-core";

import {
  ApplicationToolbarToggleGroup,
  AppTableWithControls,
  ToolbarBulkSelector,
} from "shared/components";
import {
  useFetch,
  useMultipleFetch,
  useTableControls,
  useToolbarFilter,
  useSelectionFromPageState,
} from "shared/hooks";

import {
  Application,
  ApplicationPage,
  Assessment,
  Review,
  SortByQuery,
} from "api/models";

import { ApplicationFilterKey } from "Constants";
import {
  ApplicationSortBy,
  ApplicationSortByQuery,
  createBulkCopy,
  getApplications,
  getAssessments,
} from "api/rest";
import { applicationPageMapper } from "api/apiUtils";

import { ApplicationBusinessService } from "../application-business-service";
import { ApplicationAssessment } from "../application-assessment";

const toSortByQuery = (
  sortBy?: SortByQuery
): ApplicationSortByQuery | undefined => {
  if (!sortBy) {
    return undefined;
  }

  let field: ApplicationSortBy;
  switch (sortBy.index) {
    case 2:
      field = ApplicationSortBy.NAME;
      break;
    case 6:
      field = ApplicationSortBy.REVIEW;
      break;
    case 7:
      field = ApplicationSortBy.TAGS;
      break;
    default:
      return undefined;
  }

  return {
    field,
    direction: sortBy.direction,
  };
};

const ENTITY_FIELD = "entity";

const getRow = (rowData: IRowData): Application => {
  return rowData[ENTITY_FIELD];
};

const searchAppAssessment = (id: number) => {
  const result = getAssessments({ applicationId: id }).then(({ data }) =>
    data[0] ? data[0] : undefined
  );
  return result;
};

interface CopyAssessmentFormProps {
  application: Application;
  assessment: Assessment;
  review?: Review;
}

export const CopyAssessmentForm: React.FC<CopyAssessmentFormProps> = ({
  application,
  assessment,
}) => {
  // i18
  const { t } = useTranslation();

  // Toolbar filters
  const {
    filters: filtersValue,
    isPresent: areFiltersPresent,
    addFilter,
    setFilter,
    clearAllFilters,
  } = useToolbarFilter<ToolbarChip>();

  // Table data
  const {
    paginationQuery: pagination,
    sortByQuery: sortBy,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls({
    sortByQuery: { direction: "asc", index: 2 },
  });

  const fetchApplications = useCallback(() => {
    const nameVal = filtersValue.get(ApplicationFilterKey.NAME);
    const descriptionVal = filtersValue.get(ApplicationFilterKey.DESCRIPTION);
    const serviceVal = filtersValue.get(ApplicationFilterKey.BUSINESS_SERVICE);
    const tagVal = filtersValue.get(ApplicationFilterKey.TAG);
    return getApplications(
      {
        name: nameVal?.map((f) => f.key),
        description: descriptionVal?.map((f) => f.key),
        businessService: serviceVal?.map((f) => f.key),
        tag: tagVal?.map((f) => f.key),
      },
      pagination,
      toSortByQuery(sortBy)
    );
  }, [filtersValue, pagination, sortBy]);

  const {
    data: page,
    isFetching,
    fetchError,
    requestFetch: refreshTable,
  } = useFetch<ApplicationPage>({
    defaultIsFetching: true,
    onFetch: fetchApplications,
  });

  const applications = useMemo(() => {
    return page ? applicationPageMapper(page) : undefined;
  }, [page]);

  useEffect(() => {
    refreshTable();
  }, [filtersValue, pagination, sortBy, refreshTable]);

  // Table's assessments
  const {
    getData: getApplicationAssessment,
    isFetching: isFetchingApplicationAssessment,
    fetchError: fetchErrorApplicationAssessment,
    fetchCount: fetchCountApplicationAssessment,
    triggerFetch: fetchApplicationsAssessment,
  } = useMultipleFetch<number, Assessment | undefined>({
    onFetchPromise: searchAppAssessment,
  });

  useEffect(() => {
    if (applications) {
      fetchApplicationsAssessment(applications.data.map((f) => f.id!));
    }
  }, [applications, fetchApplicationsAssessment]);

  // Select rows
  const {
    selectedItems: selectedRows,
    areAllSelected: areAllApplicationsSelected,
    isItemSelected: isRowSelected,
    toggleItemSelected: toggleRowSelected,
    setSelectedItems: setSelectedRows,
  } = useSelectionFromPageState<Application>({
    pageItems: applications?.data || [],
    totalItems: applications?.meta.count || 0,
    isEqual: (a, b) => a.id === b.id,
  });

  // Table
  const columns: ICell[] = [
    {
      title: t("terms.name"),
      transforms: [sortable, cellWidth(45)],
      cellTransforms: [truncate],
    },
    {
      title: t("terms.businessService"),
      transforms: [sortable, cellWidth(35)],
      cellTransforms: [truncate],
    },
    {
      title: t("terms.assessment"),
      transforms: [sortable, cellWidth(20)],
      cellTransforms: [truncate],
    },
  ];

  const rows: IRow[] = [];
  applications?.data.forEach((item) => {
    const isSelected = isRowSelected(item);

    rows.push({
      [ENTITY_FIELD]: item,
      selected: isSelected,
      disableCheckbox: item.id === application.id,
      cells: [
        {
          title: item.name,
        },
        {
          title: (
            <>
              {item.businessService && (
                <ApplicationBusinessService id={item.businessService} />
              )}
            </>
          ),
        },
        {
          title: (
            <ApplicationAssessment
              assessment={getApplicationAssessment(item.id!)}
              isFetching={isFetchingApplicationAssessment(item.id!)}
              fetchError={fetchErrorApplicationAssessment(item.id!)}
              fetchCount={fetchCountApplicationAssessment(item.id!)}
            />
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
    const row = getRow(rowData);
    toggleRowSelected(row);
  };

  // Copy
  const onSubmit = () => {
    createBulkCopy({
      fromAssessmentId: assessment.id!,
      applications: selectedRows.map((f) => ({ applicationId: f.id! })),
    }).then(() => {
      console.log("hello");
    });
  };

  return (
    <div>
      <AppTableWithControls
        variant="compact"
        count={applications ? applications.meta.count : 0}
        pagination={pagination}
        sortBy={sortBy}
        onPaginationChange={handlePaginationChange}
        onSort={handleSortChange}
        onSelect={selectRow}
        canSelectAll={false}
        cells={columns}
        rows={rows}
        isLoading={isFetching}
        loadingVariant="skeleton"
        fetchError={fetchError}
        toolbarClearAllFilters={clearAllFilters}
        filtersApplied={areFiltersPresent}
        toolbarBulkSelector={
          <ToolbarItem variant="bulk-select">
            <ToolbarBulkSelector
              areAllRowsSelected={areAllApplicationsSelected}
              pageSize={applications?.data.length || 0}
              totalItems={applications?.meta.count || 0}
              totalSelectedRows={selectedRows.length}
              onSelectNone={() => setSelectedRows([])}
              onSelectCurrentPage={() => {
                setSelectedRows(
                  (applications ? applications.data : []).filter(
                    (f) => f.id !== application.id
                  )
                );
              }}
            />
          </ToolbarItem>
        }
        toolbarToggle={
          <ApplicationToolbarToggleGroup
            value={filtersValue as Map<ApplicationFilterKey, ToolbarChip[]>}
            addFilter={addFilter}
            setFilter={setFilter}
          />
        }
      />

      <ActionGroup>
        <Button
          type="button"
          aria-label="copy"
          variant={ButtonVariant.primary}
          onClick={onSubmit}
          isDisabled={selectedRows.length === 0}
        >
          {t("actions.copy")}
        </Button>
      </ActionGroup>
    </div>
  );
};
