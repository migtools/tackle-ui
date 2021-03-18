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
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  expandable,
  IAction,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  ISeparator,
  sortable,
} from "@patternfly/react-table";
import { PencilAltIcon } from "@patternfly/react-icons";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";
import { confirmDialogActions } from "store/confirmDialog";

import {
  AppPlaceholder,
  AppTableToolbarToggleGroup,
  AppTableWithControls,
  ConditionalRender,
  NoDataEmptyState,
  SearchFilter,
  StatusIconAssessment,
  StatusIconAssessmentType,
} from "shared/components";
import {
  useDeleteApplication,
  useTableControls,
  useFetchApplications,
} from "shared/hooks";

import { formatPath, Paths } from "Paths";
import { Application, Assessment, SortByQuery } from "api/models";
import {
  ApplicationSortBy,
  ApplicationSortByQuery,
  createAssessment,
  getAssessments,
} from "api/rest";
import { getAxiosErrorMessage } from "utils/utils";

import { NewApplicationModal } from "./components/new-application-modal";
import { UpdateApplicationModal } from "./components/update-application-modal";
import { RemoteBusinessService } from "./components/remote-business-service";
import { RemoteAssessment } from "./components/remote-assessment";

enum FilterKey {
  NAME = "name",
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

const getStatusIconFrom = (
  assessment: Assessment
): StatusIconAssessmentType => {
  switch (assessment.status) {
    case "EMPTY":
      return "NotStarted";
    case "STARTED":
      return "InProgress";
    case "COMPLETE":
      return "Completed";
    default:
      return "NotStarted";
  }
};

export const ApplicationList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const { deleteApplication } = useDeleteApplication();
  const {
    applications,
    isFetching,
    fetchError,
    fetchApplications,
  } = useFetchApplications(true);

  // Filters

  const filters = [
    {
      key: FilterKey.NAME,
      name: t("terms.name"),
    },
  ];
  const [filtersValue, setFiltersValue] = useState<Map<FilterKey, string[]>>(
    new Map([])
  );

  // Create and edit app modal states

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [rowToUpdate, setRowToUpdate] = useState<Application>();

  // Fetch data

  const {
    paginationQuery,
    sortByQuery,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls({
    sortByQuery: { direction: "asc", index: 2 },
  });

  useEffect(() => {
    fetchApplications(
      {
        name: filtersValue.get(FilterKey.NAME),
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filtersValue, paginationQuery, sortByQuery, fetchApplications]);

  const refreshTable = useCallback(() => {
    fetchApplications(
      {
        name: filtersValue.get(FilterKey.NAME),
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
    { title: t("terms.assessment"), transforms: [] },
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
          title: (
            <>
              {item.businessService && (
                <RemoteBusinessService
                  businessServiceId={Number(item.businessService)}
                >
                  {({ businessService, fetchError }) =>
                    fetchError
                      ? t("terms.unknown")
                      : businessService?.name || ""
                  }
                </RemoteBusinessService>
              )}
            </>
          ),
        },
        {
          title: (
            <>
              {item.id && (
                <RemoteAssessment applicationId={item.id}>
                  {({ assessment, fetchError }) => (
                    <ConditionalRender
                      when={!!fetchError}
                      then={t("terms.unknown")}
                    >
                      {assessment ? (
                        <StatusIconAssessment
                          status={getStatusIconFrom(assessment)}
                        />
                      ) : (
                        <StatusIconAssessment status="NotStarted" />
                      )}
                    </ConditionalRender>
                  )}
                </RemoteAssessment>
              )}
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
      // {
      //   title: t("actions.assess"),
      //   onClick: (
      //     event: React.MouseEvent,
      //     rowIndex: number,
      //     rowData: IRowData
      //   ) => {
      //     const row: Application = getRow(rowData);
      //     startApplicationAssessment(row);
      //   },
      // },
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

  // Row event handlers

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

  // Advanced filters event handlers

  const handleOnClearAllFilters = () => {
    setFiltersValue((current) => {
      const newVal = new Map(current);
      Array.from(newVal.keys()).forEach((key) => {
        newVal.set(key, []);
      });
      return newVal;
    });
  };

  const handleOnAddFilter = (key: string, filterText: string) => {
    const filterKey: FilterKey = key as FilterKey;
    setFiltersValue((current) => {
      const values: string[] = current.get(filterKey) || [];
      return new Map(current).set(filterKey, [...values, filterText]);
    });

    handlePaginationChange({ page: 1 });
  };

  const handleOnDeleteFilter = (key: string, value: string[]) => {
    const filterKey: FilterKey = key as FilterKey;
    setFiltersValue((current) => new Map(current).set(filterKey, value));
  };

  // Create App modal

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
          type: "stakeholder",
        })
      )
    );
  };

  const handleOnCreateNewCancel = () => {
    setIsNewModalOpen(false);
  };

  // Update app Modal

  const handleOnUpdated = () => {
    setRowToUpdate(undefined);
    refreshTable();
  };

  const handleOnUpdatedCancel = () => {
    setRowToUpdate(undefined);
  };

  // General actions

  const startApplicationAssessment = (row: Application) => {
    getAssessments({ applicationId: row.id })
      .then(({ data }) => {
        const currentAssessment: Assessment | undefined = data[0];

        const newAssessment = {
          applicationId: row.id,
        } as Assessment;

        return Promise.all([
          currentAssessment,
          !currentAssessment ? createAssessment(newAssessment) : undefined,
        ]);
      })
      .then(([currentAssessment, newAssessment]) => {
        history.push(
          formatPath(Paths.applicationInventory_assessment, {
            assessmentId: currentAssessment
              ? currentAssessment.id
              : newAssessment?.data.id,
          })
        );
      })
      .catch((error) => {
        dispatch(alertActions.addDanger(getAxiosErrorMessage(error)));
      });
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
            handlePaginationChange={handlePaginationChange}
            handleSortChange={handleSortChange}
            onCollapse={collapseRow}
            onSelect={selectRow}
            canSelectAll={false}
            columns={columns}
            rows={rows}
            actionResolver={actionResolver}
            areActionsDisabled={areActionsDisabled}
            isLoading={isFetching}
            loadingVariant="skeleton"
            fetchError={fetchError}
            clearAllFilters={handleOnClearAllFilters}
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
                <SearchFilter
                  options={filters}
                  onApplyFilter={handleOnAddFilter}
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
                      isDisabled={selectedRows.length !== 1}
                    >
                      {t("actions.assess")}
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </>
            }
            noDataState={
              <NoDataEmptyState
                title={t("composed.noDataStateTitle", {
                  what: t("terms.applications").toLocaleLowerCase(),
                })}
                description={t("composed.noDataStateBody", {
                  what: t("terms.application").toLocaleLowerCase(),
                })}
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
    </>
  );
};
