import React, { useCallback, useEffect, useMemo, useState } from "react";
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
  Card,
  CardBody,
  Checkbox,
  Form,
  FormGroup,
  ToolbarChip,
  ToolbarItem,
} from "@patternfly/react-core";
import { WarningTriangleIcon } from "@patternfly/react-icons";
import { global_palette_gold_400 as gold } from "@patternfly/react-tokens";

import {
  ApplicationToolbarToggleGroup,
  AppTableWithControls,
  StatusIconAssessment,
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
    case 1:
      field = ApplicationSortBy.NAME;
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
  review,
}) => {
  // i18
  const { t } = useTranslation();

  // Confirmation dialog
  const [requestConfirmation, setRequestConfirmation] = useState(false);
  const [confirmationAccepted, setConfirmationAccepted] = useState(false);

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
    sortByQuery: { direction: "asc", index: 1 },
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
      transforms: [sortable, cellWidth(40)],
      cellTransforms: [truncate],
    },
    {
      title: t("terms.businessService"),
      transforms: [cellWidth(30)],
      cellTransforms: [truncate],
    },
    {
      title: t("terms.assessment"),
      transforms: [cellWidth(15)],
      cellTransforms: [truncate],
    },
    {
      title: t("terms.review"),
      transforms: [cellWidth(15)],
      cellTransforms: [truncate],
    },
  ];

  const rows: IRow[] = [];
  applications?.data.forEach((item) => {
    const isSelected = isRowSelected(item);

    rows.push({
      [ENTITY_FIELD]: item,
      selected: isSelected,
      disableSelection: item.id === application.id,
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
        {
          title: item.review ? (
            <StatusIconAssessment status="Completed" />
          ) : (
            <StatusIconAssessment status="NotStarted" />
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

  // Confirmation checbox
  useEffect(() => {
    let selectedAnyAppWithAssessment = selectedRows.some((f) =>
      getApplicationAssessment(f.id!)
    );

    if (review) {
      const selectedAnyAppWithReview = selectedRows.some((f) => f.review);
      selectedAnyAppWithAssessment =
        selectedAnyAppWithAssessment || selectedAnyAppWithReview;
    }

    setRequestConfirmation(selectedAnyAppWithAssessment);
  }, [review, selectedRows, getApplicationAssessment]);

  useEffect(() => {
    setConfirmationAccepted(false);
  }, [requestConfirmation]);

  // Copy
  const onSubmit = () => {
    if (requestConfirmation) {
    } else {
    }

    // createBulkCopy({
    //   fromAssessmentId: assessment.id!,
    //   applications: selectedRows.map((f) => ({ applicationId: f.id! })),
    // }).then(() => {
    //   console.log("hello");
    // });
  };

  return (
    <Form>
      <Card>
        <CardBody style={{ padding: 0 }}>
          <AppTableWithControls
            variant="compact"
            withoutBottomPagination
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
        </CardBody>
      </Card>
      {requestConfirmation && (
        <FormGroup
          fieldId="confirm"
          label="Copy and replace assessments?"
          labelIcon={
            <button
              type="button"
              aria-label="warning-icon"
              onClick={(e) => e.preventDefault()}
              aria-describedby="form-group-label-info"
              className="pf-c-form__group-label-help"
            >
              <WarningTriangleIcon noVerticalAlign color={gold.value} />
            </button>
          }
        >
          <Checkbox
            id="confirm"
            name="confirm"
            label="Yes, continue"
            description="Some of the selected target applications have an in-progress or complete assessment. By continuing, the existing assessment(s) will be replaced by the copied assessment. Do you wish to continue?"
            aria-label="Confirm"
            isChecked={confirmationAccepted}
            onChange={(isChecked) => setConfirmationAccepted(isChecked)}
          />
        </FormGroup>
      )}
      <ActionGroup>
        <Button
          type="button"
          aria-label="copy"
          variant={ButtonVariant.primary}
          onClick={onSubmit}
          isDisabled={
            selectedRows.length === 0 ||
            (requestConfirmation && !confirmationAccepted)
          }
        >
          {t("actions.copy")}
        </Button>
      </ActionGroup>
    </Form>
  );
};
