import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation, Trans } from "react-i18next";

import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Spinner,
  Stack,
  StackItem,
  Text,
  TextContent,
  ToolbarChip,
} from "@patternfly/react-core";

import {
  ApplicationToolbarToggleGroup,
  AppTableWithControls,
  NoDataEmptyState,
  OptionWithValue,
} from "shared/components";
import {
  useApplicationToolbarFilter,
  useFetch,
  useFetchApplicationDependencies,
  useFetchApplications,
  useTableControls,
} from "shared/hooks";

import {
  Application,
  ApplicationDependency,
  ApplicationPage,
  Assessment,
  SortByQuery,
} from "api/models";

import { ApplicationFilterKey } from "Constants";
import { getAxiosErrorMessage } from "utils/utils";
import {
  ApplicationSortBy,
  ApplicationSortByQuery,
  createBulkCopy,
  getApplications,
} from "api/rest";
import { applicationPageMapper } from "api/apiUtils";
import {
  cellWidth,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  sortable,
} from "@patternfly/react-table";
import { useSelectionState } from "@konveyor/lib-ui";

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

interface CopyAssessmentFormProps {
  application: Application;
  assessment: Assessment;
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
  } = useApplicationToolbarFilter();

  // Table data
  const {
    paginationQuery,
    sortByQuery,
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
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filtersValue, paginationQuery, sortByQuery]);

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
  }, [filtersValue, paginationQuery, sortByQuery, refreshTable]);

  // Select rows
  const {
    isItemSelected: isRowSelected,
    toggleItemSelected: toggleRowSelected,
    selectedItems: selectedRows,
  } = useSelectionState<Application>({
    items: applications?.data || [],
    isEqual: (a, b) => a.id === b.id,
  });

  // Table
  const columns: ICell[] = [
    {
      title: t("terms.name"),
      transforms: [sortable, cellWidth(100)],
      cellFormatters: [],
    },
  ];

  const rows: IRow[] = [];
  applications?.data.forEach((item) => {
    const isSelected = isRowSelected(item);

    rows.push({
      [ENTITY_FIELD]: item,
      selected: isSelected,
      cells: [
        {
          title: item.name,
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
    <Form>
      <Grid>
        <GridItem md={7}>
          <Stack hasGutter>
            <StackItem>
              <TextContent>
                <Text component="h3">Available options</Text>
              </TextContent>
            </StackItem>
            <StackItem>
              <AppTableWithControls
                variant="compact"
                count={applications ? applications.meta.count : 0}
                pagination={paginationQuery}
                sortBy={sortByQuery}
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
                toolbarToggle={
                  <ApplicationToolbarToggleGroup
                    value={
                      filtersValue as Map<ApplicationFilterKey, ToolbarChip[]>
                    }
                    addFilter={addFilter}
                    setFilter={setFilter}
                  />
                }
                noDataState={
                  <NoDataEmptyState
                    // t('terms.applications')
                    title={t("composed.noDataStateTitle", {
                      what: t("terms.applications").toLowerCase(),
                    })}
                    // t('terms.application')
                    description={
                      t("composed.noDataStateBody", {
                        what: t("terms.application").toLowerCase(),
                      }) + "."
                    }
                  />
                }
              />
            </StackItem>
          </Stack>
        </GridItem>
        <GridItem md={5}>
          <Stack hasGutter>
            <StackItem>
              <TextContent>
                <Text component="h3">Choosen options</Text>
              </TextContent>
            </StackItem>
            <StackItem>content</StackItem>
          </Stack>
        </GridItem>
      </Grid>

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
    </Form>
  );
};
