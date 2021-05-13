import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";
import { useSelectionState } from "@konveyor/lib-ui";

import {
  Button,
  ButtonVariant,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Modal,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  ToolbarChip,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  cellWidth,
  expandable,
  IAction,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  ISeparator,
  sortable,
} from "@patternfly/react-table";
import { PencilAltIcon, TagIcon } from "@patternfly/react-icons";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";
import { confirmDialogActions } from "store/confirmDialog";

import {
  AppPlaceholder,
  AppTableToolbarToggleGroup,
  AppTableWithControls,
  ConditionalRender,
  NoDataEmptyState,
  StatusIconAssessment,
} from "shared/components";
import {
  useDeleteApplication,
  useTableControls,
  useFetchApplications,
  useAssessApplication,
} from "shared/hooks";

import { formatPath, Paths } from "Paths";
import { Application, Assessment, SortByQuery } from "api/models";
import { ApplicationSortBy, ApplicationSortByQuery } from "api/rest";
import { getAxiosErrorMessage } from "utils/utils";

import { NewApplicationModal } from "./components/new-application-modal";
import { UpdateApplicationModal } from "./components/update-application-modal";
import { ToolbarSearchFilter } from "./components/toolbar-search-filter";
import { InputTextFilter } from "./components/toolbar-search-filter/input-text-filter";
import { SelectBusinessServiceFilter } from "./components/toolbar-search-filter/select-business-service-filter";
import { ApplicationAssessment } from "./components/application-assessment";
import { ApplicationBusinessService } from "./components/application-business-service";

import { ApplicationTags } from "./components/application-tags/application-tags";
import { SelectTagFilter } from "./components/toolbar-search-filter/select-tag-filter";
import ApplicationDependenciesForm from "./components/application-dependencies-form";

enum FilterKey {
  NAME = "name",
  DESCRIPTION = "description",
  BUSINESS_SERVICE = "businessService",
  TAG = "tag",
}

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
    case 7:
      field = ApplicationSortBy.TAGS;
      break;
    default:
      throw new Error("Invalid column index=" + sortBy.index);
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

export const ApplicationList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const filters = [
    {
      key: FilterKey.NAME,
      name: t("terms.name"),
    },
    {
      key: FilterKey.DESCRIPTION,
      name: t("terms.description"),
    },
    {
      key: FilterKey.BUSINESS_SERVICE,
      name: t("terms.businessService"),
    },
    {
      key: FilterKey.TAG,
      name: t("terms.tag"),
    },
  ];
  const [filtersValue, setFiltersValue] = useState<
    Map<FilterKey, ToolbarChip[]>
  >(new Map([]));

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [rowToUpdate, setRowToUpdate] = useState<Application>();
  const [
    rowToManageDependencies,
    setRowToManageDependencies,
  ] = useState<Application>();

  const { deleteApplication } = useDeleteApplication();

  const {
    assessApplication,
    inProgress: isApplicationAssessInProgress,
  } = useAssessApplication();
  const {
    getCurrentAssessment,
    inProgress: isApplicationReviewInProgress,
  } = useAssessApplication();

  const {
    applications,
    isFetching,
    fetchError,
    fetchApplications,
  } = useFetchApplications(true);

  const {
    paginationQuery,
    sortByQuery,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls({
    sortByQuery: { direction: "asc", index: 2 },
  });

  const refreshTable = useCallback(() => {
    fetchApplications(
      {
        name: filtersValue.get(FilterKey.NAME)?.map((f) => f.key),
        description: filtersValue.get(FilterKey.DESCRIPTION)?.map((f) => f.key),
        businessService: filtersValue
          .get(FilterKey.BUSINESS_SERVICE)
          ?.map((f) => f.key),
        tag: filtersValue.get(FilterKey.TAG)?.map((f) => f.key),
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filtersValue, paginationQuery, sortByQuery, fetchApplications]);

  useEffect(() => {
    fetchApplications(
      {
        name: filtersValue.get(FilterKey.NAME)?.map((f) => f.key),
        description: filtersValue.get(FilterKey.DESCRIPTION)?.map((f) => f.key),
        businessService: filtersValue
          .get(FilterKey.BUSINESS_SERVICE)
          ?.map((f) => f.key),
        tag: filtersValue.get(FilterKey.TAG)?.map((f) => f.key),
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filtersValue, paginationQuery, sortByQuery, fetchApplications]);

  // Expansion and selection of rows

  const {
    isItemSelected: isRowExpanded,
    toggleItemSelected: toggleRowExpanded,
  } = useSelectionState<Application>({
    items: applications?.data || [],
    isEqual: (a, b) => a.id === b.id,
  });

  const {
    isItemSelected: isRowSelected,
    toggleItemSelected: toggleRowSelected,
    selectedItems: selectedRows,
  } = useSelectionState<Application>({
    items: applications?.data || [],
    isEqual: (a, b) => a.id === b.id,
  });

  // Table content definition

  const columns: ICell[] = [
    {
      title: t("terms.name"),
      transforms: [sortable],
      cellFormatters: [expandable],
    },
    { title: t("terms.description"), transforms: [] },
    { title: t("terms.businessService"), transforms: [] },
    { title: t("terms.assessment"), transforms: [cellWidth(10)] },
    { title: t("terms.review"), transforms: [cellWidth(10)] },
    { title: t("terms.tags"), transforms: [sortable, cellWidth(10)] },
    {
      title: "",
      props: {
        className: "pf-c-table__inline-edit-action",
      },
    },
  ];

  const rows: IRow[] = [];
  applications?.data.forEach((item) => {
    const isExpanded = isRowExpanded(item);
    const isSelected = isRowSelected(item);

    rows.push({
      [ENTITY_FIELD]: item,
      isOpen: isExpanded,
      selected: isSelected,
      cells: [
        {
          title: item.name,
        },
        {
          title: item.description,
        },
        {
          title: <ApplicationBusinessService application={item} />,
        },
        {
          title: <ApplicationAssessment application={item} />,
        },
        {
          title: item.review ? (
            <StatusIconAssessment status="Completed" />
          ) : (
            <StatusIconAssessment status="NotStarted" />
          ),
        },
        {
          title: (
            <>
              <TagIcon /> {item.tags ? item.tags.length : 0}
            </>
          ),
        },
        {
          title: (
            <div className="pf-c-inline-edit__action pf-m-enable-editable">
              <Button
                type="button"
                variant="plain"
                onClick={() => editRow(item)}
              >
                <PencilAltIcon />
              </Button>
            </div>
          ),
        },
      ],
    });

    rows.push({
      parent: rows.length - 1,
      fullWidth: false,
      cells: [
        <div className="pf-c-table__expandable-row-content">
          <DescriptionList isHorizontal>
            <DescriptionListGroup>
              <DescriptionListTerm>{t("terms.tags")}</DescriptionListTerm>
              <DescriptionListDescription>
                <ApplicationTags application={item} />
              </DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
              <DescriptionListTerm>{t("terms.comments")}</DescriptionListTerm>
              <DescriptionListDescription>
                {item.comments}
              </DescriptionListDescription>
            </DescriptionListGroup>
          </DescriptionList>
        </div>,
      ],
    });
  });

  const actionResolver = (rowData: IRowData): (IAction | ISeparator)[] => {
    const row: Application = getRow(rowData);
    if (!row) {
      return [];
    }

    const actions: (IAction | ISeparator)[] = [
      {
        title: t("actions.manageDependencies"),
        onClick: (
          event: React.MouseEvent,
          rowIndex: number,
          rowData: IRowData
        ) => {
          const row: Application = getRow(rowData);
          setRowToManageDependencies(row);
        },
      },
      {
        title: t("actions.delete"),
        onClick: (
          event: React.MouseEvent,
          rowIndex: number,
          rowData: IRowData
        ) => {
          const row: Application = getRow(rowData);
          deleteRow(row);
        },
      },
    ];

    return actions;
  };

  const areActionsDisabled = (): boolean => {
    return false;
  };

  // Rows

  const collapseRow = (
    event: React.MouseEvent,
    rowIndex: number,
    isOpen: boolean,
    rowData: IRowData,
    extraData: IExtraData
  ) => {
    const row = getRow(rowData);
    toggleRowExpanded(row);
  };

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

  const editRow = (row: Application) => {
    setRowToUpdate(row);
  };

  const deleteRow = (row: Application) => {
    dispatch(
      confirmDialogActions.openDialog({
        title: t("dialog.title.delete", { what: row.name }),
        message: t("dialog.message.delete", { what: row.name }),
        variant: ButtonVariant.danger,
        confirmBtnLabel: t("actions.delete"),
        cancelBtnLabel: t("actions.cancel"),
        onConfirm: () => {
          dispatch(confirmDialogActions.processing());
          deleteApplication(
            row,
            () => {
              dispatch(confirmDialogActions.closeDialog());
              refreshTable();
            },
            (error) => {
              dispatch(confirmDialogActions.closeDialog());
              dispatch(alertActions.addDanger(getAxiosErrorMessage(error)));
            }
          );
        },
      })
    );
  };

  // Advanced filters

  const handleOnClearAllFilters = () => {
    setFiltersValue((current) => {
      const newVal = new Map(current);
      Array.from(newVal.keys()).forEach((key) => {
        newVal.set(key, []);
      });
      return newVal;
    });
  };

  const handleOnAddFilter = (
    key: string,
    value: ToolbarChip | ToolbarChip[]
  ) => {
    const filterKey: FilterKey = key as FilterKey;

    setFiltersValue((current) => {
      if (Array.isArray(value)) {
        return new Map(current).set(filterKey, value);
      } else {
        const currentChips: ToolbarChip[] = current.get(filterKey) || [];
        return new Map(current).set(filterKey, [...currentChips, value]);
      }
    });

    handlePaginationChange({ page: 1 });
  };

  const handleOnDeleteFilter = (
    key: string,
    value: (string | ToolbarChip)[]
  ) => {
    const filterKey: FilterKey = key as FilterKey;
    setFiltersValue((current) =>
      new Map(current).set(filterKey, value as ToolbarChip[])
    );
  };

  // Create Modal

  const handleOnOpenCreateNewModal = () => {
    setIsNewModalOpen(true);
  };

  const handleOnCreatedNew = (response: AxiosResponse<Application>) => {
    setIsNewModalOpen(false);
    refreshTable();

    dispatch(
      alertActions.addSuccess(
        t("toastr.success.added", {
          what: response.data.name,
          type: "application",
        })
      )
    );
  };

  const handleOnCreateNewCancel = () => {
    setIsNewModalOpen(false);
  };

  // Update Modal

  const handleOnUpdated = () => {
    setRowToUpdate(undefined);
    refreshTable();
  };

  const handleOnUpdatedCancel = () => {
    setRowToUpdate(undefined);
  };

  // General actions

  const startApplicationAssessment = (row: Application) => {
    assessApplication(
      row,
      (assessment: Assessment) => {
        const redirectToAssessment = () => {
          history.push(
            formatPath(Paths.applicationInventory_assessment, {
              assessmentId: assessment.id,
            })
          );
        };

        if (assessment.status === "COMPLETE") {
          dispatch(
            confirmDialogActions.openDialog({
              // t("terms.assessment")
              title: t("composed.editQuestion", {
                what: t("terms.assessment").toLowerCase(),
              }),
              titleIconVariant: "warning",
              message: t("message.overrideAssessmentConfirmation"),
              variant: ButtonVariant.primary,
              confirmBtnLabel: t("actions.continue"),
              cancelBtnLabel: t("actions.cancel"),
              onConfirm: () => {
                dispatch(confirmDialogActions.closeDialog());
                redirectToAssessment();
              },
            })
          );
        } else {
          redirectToAssessment();
        }
      },
      (error) => {
        dispatch(alertActions.addDanger(getAxiosErrorMessage(error)));
      }
    );
  };

  const handleOnAssessSelectedRow = () => {
    if (selectedRows.length !== 1) {
      dispatch(
        alertActions.addDanger(
          "The number of applications to be assess must be 1"
        )
      );
      return;
    }

    const row = selectedRows[0];
    startApplicationAssessment(row);
  };

  const startApplicationReview = (row: Application) => {
    getCurrentAssessment(
      row,
      (assessment?: Assessment) => {
        if (!assessment || (assessment && assessment.status !== "COMPLETE")) {
          dispatch(
            alertActions.addDanger(
              "You must assess the application before reviewing it"
            )
          );
        } else {
          history.push(
            formatPath(Paths.applicationInventory_review, {
              applicationId: row.id,
            })
          );
        }
      },
      (error) => {
        dispatch(alertActions.addDanger(getAxiosErrorMessage(error)));
      }
    );
  };

  const handleOnReviewSelectedRow = () => {
    if (selectedRows.length !== 1) {
      dispatch(
        alertActions.addDanger(
          "The number of applications to be reviewed must be 1"
        )
      );
      return;
    }

    const row = selectedRows[0];
    startApplicationReview(row);
  };

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{t("composed.applicationInventory")}</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <ConditionalRender
          when={isFetching && !(applications || fetchError)}
          then={<AppPlaceholder />}
        >
          <AppTableWithControls
            count={applications ? applications.meta.count : 0}
            pagination={paginationQuery}
            sortBy={sortByQuery}
            onPaginationChange={handlePaginationChange}
            onSort={handleSortChange}
            onCollapse={collapseRow}
            onSelect={selectRow}
            canSelectAll={false}
            cells={columns}
            rows={rows}
            actionResolver={actionResolver}
            areActionsDisabled={areActionsDisabled}
            isLoading={isFetching}
            loadingVariant="skeleton"
            fetchError={fetchError}
            toolbarClearAllFilters={handleOnClearAllFilters}
            filtersApplied={
              Array.from(filtersValue.values()).reduce(
                (previous, current) => [...previous, ...current],
                []
              ).length > 0
            }
            toolbarToggle={
              <AppTableToolbarToggleGroup
                options={filters}
                filtersValue={filtersValue}
                onDeleteFilter={handleOnDeleteFilter}
              >
                <ToolbarSearchFilter
                  options={filters}
                  filterInputs={[
                    {
                      key: FilterKey.NAME,
                      input: (
                        <InputTextFilter
                          onApplyFilter={(filterText) =>
                            handleOnAddFilter(FilterKey.NAME, {
                              key: filterText,
                              node: filterText,
                            })
                          }
                        />
                      ),
                    },
                    {
                      key: FilterKey.DESCRIPTION,
                      input: (
                        <InputTextFilter
                          onApplyFilter={(filterText) =>
                            handleOnAddFilter(FilterKey.DESCRIPTION, {
                              key: filterText,
                              node: filterText,
                            })
                          }
                        />
                      ),
                    },
                    {
                      key: FilterKey.BUSINESS_SERVICE,
                      input: (
                        <SelectBusinessServiceFilter
                          value={filtersValue.get(FilterKey.BUSINESS_SERVICE)}
                          onApplyFilter={(values) =>
                            handleOnAddFilter(
                              FilterKey.BUSINESS_SERVICE,
                              values
                            )
                          }
                        />
                      ),
                    },
                    {
                      key: FilterKey.TAG,
                      input: (
                        <SelectTagFilter
                          value={filtersValue.get(FilterKey.TAG)}
                          onApplyFilter={(values) =>
                            handleOnAddFilter(FilterKey.TAG, values)
                          }
                        />
                      ),
                    },
                  ]}
                />
              </AppTableToolbarToggleGroup>
            }
            toolbar={
              <>
                <ToolbarGroup variant="button-group">
                  <ToolbarItem>
                    <Button
                      type="button"
                      aria-label="create-application"
                      variant={ButtonVariant.primary}
                      onClick={handleOnOpenCreateNewModal}
                    >
                      {t("actions.createNew")}
                    </Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button
                      type="button"
                      aria-label="assess-application"
                      variant={ButtonVariant.primary}
                      onClick={handleOnAssessSelectedRow}
                      isDisabled={
                        selectedRows.length !== 1 ||
                        isApplicationAssessInProgress
                      }
                      isLoading={isApplicationAssessInProgress}
                    >
                      {t("actions.assess")}
                    </Button>
                  </ToolbarItem>
                  <ToolbarItem>
                    <Button
                      type="button"
                      aria-label="review-application"
                      variant={ButtonVariant.primary}
                      onClick={handleOnReviewSelectedRow}
                      isDisabled={
                        selectedRows.length !== 1 ||
                        isApplicationReviewInProgress
                      }
                      isLoading={isApplicationReviewInProgress}
                    >
                      {t("actions.review")}
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </>
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
        </ConditionalRender>
      </PageSection>

      <NewApplicationModal
        isOpen={isNewModalOpen}
        onSaved={handleOnCreatedNew}
        onCancel={handleOnCreateNewCancel}
      />
      <UpdateApplicationModal
        application={rowToUpdate}
        onSaved={handleOnUpdated}
        onCancel={handleOnUpdatedCancel}
      />

      <Modal
        isOpen={!!rowToManageDependencies}
        variant="medium"
        title={t("composed.manageDependenciesFor", {
          what: rowToManageDependencies?.name,
        })}
        onClose={() => setRowToManageDependencies(undefined)}
      >
        {rowToManageDependencies && (
          <ApplicationDependenciesForm
            application={rowToManageDependencies}
            onCancel={() => setRowToManageDependencies(undefined)}
          />
        )}
      </Modal>
    </>
  );
};
