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
  ModalVariant,
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
} from "shared/components";
import {
  useDeleteApplication,
  useTableControls,
  useFetchApplications,
  useEntityModal,
} from "shared/hooks";

import { formatPath, Paths } from "Paths";
import { Application, Assessment, SortByQuery } from "api/models";
import { ApplicationSortBy, ApplicationSortByQuery } from "api/rest";
import { getAxiosErrorMessage } from "utils/utils";

import { ToolbarSearchFilter } from "./components/toolbar-search-filter";
import { InputTextFilter } from "./components/toolbar-search-filter/input-text-filter";
import { SelectBusinessServiceFilter } from "./components/toolbar-search-filter/select-business-service-filter";
import { ApplicationAssessment } from "./components/application-assessment";
import { ApplicationBusinessService } from "./components/application-business-service";
import { ApplicationForm } from "./components/application-form";

import { useAssessApplication } from "./hooks/useAssessApplication";

enum FilterKey {
  NAME = "name",
  DESCRIPTION = "description",
  BUSINESS_SERVICE = "businessService",
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
  ];
  const [filtersValue, setFiltersValue] = useState<
    Map<FilterKey, ToolbarChip[]>
  >(new Map([]));

  const {
    isOpen: isCreateUpdateModalOpen,
    entity: rowToUpdate,
    create: openCreateModal,
    update: openUpdateModal,
    close: closeCreateUpdateModal,
  } = useEntityModal<Application>();

  const { deleteApplication } = useDeleteApplication();
  const {
    assessApplication,
    inProgress: isApplicationAssessInProgress,
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
    openUpdateModal(row);
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

  // Create/update Modal

  const handleOnCreateUpdateModalSaved = (
    response: AxiosResponse<Application>
  ) => {
    if (!rowToUpdate) {
      dispatch(
        alertActions.addSuccess(
          // t('terms.application')
          t("toastr.success.added", {
            what: response.data.name,
            type: t("terms.application").toLowerCase(),
          })
        )
      );
    }

    closeCreateUpdateModal();
    refreshTable();
  };

  // General actions

  const startApplicationAssessment = (row: Application) => {
    assessApplication(
      row,
      (assessment: Assessment) => {
        history.push(
          formatPath(Paths.applicationInventory_assessment, {
            assessmentId: assessment.id,
          })
        );
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
                      onClick={openCreateModal}
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

      <Modal
        // t('dialog.title.update')
        // t('dialog.title.new')
        title={t(`dialog.title.${rowToUpdate ? "update" : "new"}`, {
          what: t("terms.application").toLowerCase(),
        })}
        variant={ModalVariant.medium}
        isOpen={isCreateUpdateModalOpen}
        onClose={closeCreateUpdateModal}
      >
        <ApplicationForm
          application={rowToUpdate}
          onSaved={handleOnCreateUpdateModalSaved}
          onCancel={closeCreateUpdateModal}
        />
      </Modal>
    </>
  );
};
