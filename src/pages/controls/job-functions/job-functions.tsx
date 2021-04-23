import React, { useCallback, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";

import {
  Button,
  ButtonVariant,
  Modal,
  ModalVariant,
  ToolbarChip,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { ICell, IRow, sortable } from "@patternfly/react-table";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";
import { confirmDialogActions } from "store/confirmDialog";

import {
  AppPlaceholder,
  AppTableActionButtons,
  AppTableWithControls,
  ConditionalRender,
  AppTableToolbarToggleGroup,
  NoDataEmptyState,
  SearchFilter,
} from "shared/components";
import {
  useTableControls,
  useDeleteJobFunction,
  useFetchJobFunctions,
  useEntityModal,
} from "shared/hooks";

import { getAxiosErrorMessage } from "utils/utils";
import { JobFunctionSortBy, JobFunctionSortByQuery } from "api/rest";
import { SortByQuery, JobFunction } from "api/models";

import { JobFunctionForm } from "./components/job-function-form";

enum FilterKey {
  NAME = "name",
}

const toSortByQuery = (
  sortBy?: SortByQuery
): JobFunctionSortByQuery | undefined => {
  if (!sortBy) {
    return undefined;
  }

  let field: JobFunctionSortBy;
  switch (sortBy.index) {
    case 0:
      field = JobFunctionSortBy.ROLE;
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

export const JobFunctions: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const filters = [
    {
      key: FilterKey.NAME,
      name: t("terms.name"),
    },
  ];
  const [filtersValue, setFiltersValue] = useState<Map<FilterKey, string[]>>(
    new Map([])
  );

  const {
    isOpen: isCreateUpdateModalOpen,
    entity: rowToUpdate,
    create: openCreateModal,
    update: openUpdateModal,
    close: closeCreateUpdateModal,
  } = useEntityModal<JobFunction>();

  const { deleteJobFunction } = useDeleteJobFunction();

  const {
    jobFunctions,
    isFetching,
    fetchError,
    fetchJobFunctions,
  } = useFetchJobFunctions(true);

  const {
    paginationQuery,
    sortByQuery,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls({
    sortByQuery: { direction: "asc", index: 0 },
  });

  const refreshTable = useCallback(() => {
    fetchJobFunctions(
      {
        role: filtersValue.get(FilterKey.NAME),
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filtersValue, paginationQuery, sortByQuery, fetchJobFunctions]);

  useEffect(() => {
    fetchJobFunctions(
      {
        role: filtersValue.get(FilterKey.NAME),
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filtersValue, paginationQuery, sortByQuery, fetchJobFunctions]);

  //

  const columns: ICell[] = [
    {
      title: t("terms.name"),
      transforms: [sortable],
      cellFormatters: [],
    },
    {
      title: "",
      props: {
        className: "pf-u-text-align-right",
      },
    },
  ];

  const rows: IRow[] = [];
  jobFunctions?.data.forEach((item) => {
    rows.push({
      [ENTITY_FIELD]: item,
      cells: [
        {
          title: item.role,
        },
        {
          title: (
            <AppTableActionButtons
              onEdit={() => editRow(item)}
              onDelete={() => deleteRow(item)}
            />
          ),
        },
      ],
    });
  });

  // Rows

  const editRow = (row: JobFunction) => {
    openUpdateModal(row);
  };

  const deleteRow = (row: JobFunction) => {
    dispatch(
      confirmDialogActions.openDialog({
        title: t("dialog.title.delete", { what: row.role }),
        message: t("dialog.message.delete", { what: row.role }),
        variant: ButtonVariant.danger,
        confirmBtnLabel: t("actions.delete"),
        cancelBtnLabel: t("actions.cancel"),
        onConfirm: () => {
          dispatch(confirmDialogActions.processing());
          deleteJobFunction(
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

  const handleOnAddFilter = (key: string, filterText: string) => {
    const filterKey: FilterKey = key as FilterKey;
    setFiltersValue((current) => {
      const values: string[] = current.get(filterKey) || [];
      return new Map(current).set(filterKey, [...values, filterText]);
    });

    handlePaginationChange({ page: 1 });
  };

  const handleOnDeleteFilter = (
    key: string,
    value: (string | ToolbarChip)[]
  ) => {
    const filterKey: FilterKey = key as FilterKey;
    setFiltersValue((current) =>
      new Map(current).set(filterKey, value as string[])
    );
  };

  // Create/update Modal

  const handleOnCreateUpdateModalSaved = (
    response: AxiosResponse<JobFunction>
  ) => {
    if (!rowToUpdate) {
      dispatch(
        alertActions.addSuccess(
          // t('terms.jobFunction')
          t("toastr.success.added", {
            what: response.data.role,
            type: t("terms.jobFunction").toLowerCase(),
          })
        )
      );
    }

    closeCreateUpdateModal();
    refreshTable();
  };

  return (
    <>
      <ConditionalRender
        when={isFetching && !(jobFunctions || fetchError)}
        then={<AppPlaceholder />}
      >
        <AppTableWithControls
          count={jobFunctions ? jobFunctions.meta.count : 0}
          pagination={paginationQuery}
          sortBy={sortByQuery}
          handlePaginationChange={handlePaginationChange}
          handleSortChange={handleSortChange}
          columns={columns}
          rows={rows}
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
            <ToolbarGroup variant="button-group">
              <ToolbarItem>
                <Button
                  type="button"
                  aria-label="create-job-function"
                  variant={ButtonVariant.primary}
                  onClick={openCreateModal}
                >
                  {t("actions.createNew")}
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          }
          noDataState={
            <NoDataEmptyState
              // t('terms.jobFunctions')
              title={t("composed.noDataStateTitle", {
                what: t("terms.jobFunctions").toLowerCase(),
              })}
              // t('terms.jobFunction')
              description={
                t("composed.noDataStateBody", {
                  what: t("terms.jobFunction").toLowerCase(),
                }) + "."
              }
            />
          }
        />
      </ConditionalRender>

      <Modal
        // t('dialog.title.update')
        // t('dialog.title.new')
        // t('terms.jobFunction')
        title={t(`dialog.title.${rowToUpdate ? "update" : "new"}`, {
          what: t("terms.jobFunction").toLowerCase(),
        })}
        variant={ModalVariant.medium}
        isOpen={isCreateUpdateModalOpen}
        onClose={closeCreateUpdateModal}
      >
        <JobFunctionForm
          jobFunction={rowToUpdate}
          onSaved={handleOnCreateUpdateModalSaved}
          onCancel={closeCreateUpdateModal}
        />
      </Modal>
    </>
  );
};
