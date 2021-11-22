import React, { useCallback, useEffect, useState } from "react";
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
  ToolbarChip,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  cellWidth,
  expandable,
  ICell,
  IExtraData,
  IRow,
  IRowData,
  sortable,
  TableText,
} from "@patternfly/react-table";

import { useDispatch } from "react-redux";
import { alertActions } from "store/alert";
import { confirmDialogActions } from "store/confirmDialog";

import {
  AppPlaceholder,
  AppTableActionButtons,
  AppTableWithControls,
  ConditionalRender,
  SearchFilter,
  AppTableToolbarToggleGroup,
  NoDataEmptyState,
} from "shared/components";
import {
  useTableControls,
  useFetchStakeholders,
  useDelete,
  useEntityModal,
} from "shared/hooks";

import { getAxiosErrorMessage } from "utils/utils";
import {
  deleteStakeholder,
  StakeholderSortBy,
  StakeholderSortByQuery,
} from "api/rest";
import { Stakeholder, SortByQuery } from "api/models";

import { StakeholderForm } from "./components/stakeholder-form";

enum FilterKey {
  EMAIL = "email",
  DISPLAY_NAME = "displayName",
  JOB_FUNCTION = "jobFunction",
  STAKEHOLDER_GROUP = "stakeholderGroup",
}

const toSortByQuery = (
  sortBy?: SortByQuery
): StakeholderSortByQuery | undefined => {
  if (!sortBy) {
    return undefined;
  }

  let field: StakeholderSortBy;
  switch (sortBy.index) {
    case 1:
      field = StakeholderSortBy.EMAIL;
      break;
    case 2:
      field = StakeholderSortBy.DISPLAY_NAME;
      break;
    case 3:
      field = StakeholderSortBy.JOB_FUNCTION;
      break;
    case 4:
      field = StakeholderSortBy.STAKEHOLDER_GROUPS_COUNT;
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

const getRow = (rowData: IRowData): Stakeholder => {
  return rowData[ENTITY_FIELD];
};

export const Stakeholders: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const filters = [
    {
      key: FilterKey.EMAIL,
      name: t("terms.email"),
    },
    {
      key: FilterKey.DISPLAY_NAME,
      name: t("terms.displayName"),
    },
    {
      key: FilterKey.JOB_FUNCTION,
      name: t("terms.jobFunction"),
    },
    {
      key: FilterKey.STAKEHOLDER_GROUP,
      name: t("terms.group"),
    },
  ];
  const [filtersValue, setFiltersValue] = useState<Map<FilterKey, string[]>>(
    new Map([])
  );

  const {
    isOpen: isStakeholderModalOpen,
    data: stakeholderToUpdate,
    create: openCreateStakeholderModal,
    update: openUpdateStakeholderModal,
    close: closeStakeholderModal,
  } = useEntityModal<Stakeholder>();

  const { requestDelete: requestDeleteStakeholder } = useDelete<Stakeholder>({
    onDelete: (t: Stakeholder) => deleteStakeholder(t.id!),
  });

  const {
    stakeholders,
    isFetching,
    fetchError,
    fetchStakeholders,
  } = useFetchStakeholders(true);

  const {
    paginationQuery,
    sortByQuery,
    handlePaginationChange,
    handleSortChange,
  } = useTableControls({
    sortByQuery: { direction: "asc", index: 1 },
  });

  const {
    isItemSelected: isItemExpanded,
    toggleItemSelected: toggleItemExpanded,
  } = useSelectionState<Stakeholder>({
    items: stakeholders?.data || [],
    isEqual: (a, b) => a.id === b.id,
  });

  const refreshTable = useCallback(() => {
    fetchStakeholders(
      {
        email: filtersValue.get(FilterKey.EMAIL),
        displayName: filtersValue.get(FilterKey.DISPLAY_NAME),
        jobFunction: filtersValue.get(FilterKey.JOB_FUNCTION),
        stakeholderGroup: filtersValue.get(FilterKey.STAKEHOLDER_GROUP),
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filtersValue, paginationQuery, sortByQuery, fetchStakeholders]);

  useEffect(() => {
    fetchStakeholders(
      {
        email: filtersValue.get(FilterKey.EMAIL),
        displayName: filtersValue.get(FilterKey.DISPLAY_NAME),
        jobFunction: filtersValue.get(FilterKey.JOB_FUNCTION),
        stakeholderGroup: filtersValue.get(FilterKey.STAKEHOLDER_GROUP),
      },
      paginationQuery,
      toSortByQuery(sortByQuery)
    );
  }, [filtersValue, paginationQuery, sortByQuery, fetchStakeholders]);

  const columns: ICell[] = [
    {
      title: t("terms.email"),
      transforms: [sortable, cellWidth(20)],
      cellFormatters: [expandable],
    },
    { title: t("terms.displayName"), transforms: [sortable, cellWidth(25)] },
    { title: t("terms.jobFunction"), transforms: [sortable, cellWidth(20)] },
    {
      title: t("terms.groupCount"),
      transforms: [sortable],
    },
    {
      title: "",
      props: {
        className: "pf-u-text-align-right",
      },
    },
  ];

  const rows: IRow[] = [];
  stakeholders?.data.forEach((item) => {
    const isExpanded = isItemExpanded(item);
    rows.push({
      [ENTITY_FIELD]: item,
      isOpen: isExpanded,
      cells: [
        {
          title: item.email,
        },
        {
          title: (
            <TableText wrapModifier="truncate">{item.displayName}</TableText>
          ),
        },
        {
          title: (
            <TableText wrapModifier="truncate">
              {item.jobFunction?.role}
            </TableText>
          ),
        },
        {
          title: item.stakeholderGroups ? item.stakeholderGroups.length : 0,
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

    if (isExpanded) {
      rows.push({
        parent: rows.length - 1,
        fullWidth: false,
        cells: [
          <div className="pf-c-table__expandable-row-content">
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTerm>{t("terms.group(s)")}</DescriptionListTerm>
                <DescriptionListDescription>
                  {item.stakeholderGroups?.map((f) => f.name).join(", ")}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </div>,
        ],
      });
    }
  });

  // Rows

  const collapseRow = (
    event: React.MouseEvent,
    rowIndex: number,
    isOpen: boolean,
    rowData: IRowData,
    extraData: IExtraData
  ) => {
    const row = getRow(rowData);
    toggleItemExpanded(row);
  };

  const editRow = (row: Stakeholder) => {
    openUpdateStakeholderModal(row);
  };

  const deleteRow = (row: Stakeholder) => {
    dispatch(
      confirmDialogActions.openDialog({
        // t("terms.stakeholder")
        title: t("dialog.title.delete", {
          what: t("terms.stakeholder").toLowerCase(),
        }),
        titleIconVariant: "warning",
        message: t("dialog.message.delete"),
        confirmBtnVariant: ButtonVariant.danger,
        confirmBtnLabel: t("actions.delete"),
        cancelBtnLabel: t("actions.cancel"),
        onConfirm: () => {
          dispatch(confirmDialogActions.processing());
          requestDeleteStakeholder(
            row,
            () => {
              dispatch(confirmDialogActions.closeDialog());
              if (stakeholders?.data.length === 1) {
                handlePaginationChange({ page: paginationQuery.page - 1 });
              } else {
                refreshTable();
              }
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

  const handleOnStakeholderFormSaved = (
    response: AxiosResponse<Stakeholder>
  ) => {
    if (!stakeholderToUpdate) {
      dispatch(
        alertActions.addSuccess(
          // t('terms.stakeholder')
          t("toastr.success.added", {
            what: response.data.displayName,
            type: t("terms.stakeholder").toLowerCase(),
          })
        )
      );
    }

    closeStakeholderModal();
    refreshTable();
  };

  return (
    <>
      <ConditionalRender
        when={isFetching && !(stakeholders || fetchError)}
        then={<AppPlaceholder />}
      >
        <AppTableWithControls
          count={stakeholders ? stakeholders.meta.count : 0}
          pagination={paginationQuery}
          sortBy={sortByQuery}
          onPaginationChange={handlePaginationChange}
          onSort={handleSortChange}
          onCollapse={collapseRow}
          cells={columns}
          rows={rows}
          // actions={actions}
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
              categories={filters}
              chips={filtersValue}
              onChange={handleOnDeleteFilter}
            >
              <SearchFilter
                options={filters}
                onApplyFilter={handleOnAddFilter}
              />
            </AppTableToolbarToggleGroup>
          }
          toolbarActions={
            <ToolbarGroup variant="button-group">
              <ToolbarItem>
                <Button
                  type="button"
                  aria-label="create-stakeholder"
                  variant={ButtonVariant.primary}
                  onClick={openCreateStakeholderModal}
                >
                  {t("actions.createNew")}
                </Button>
              </ToolbarItem>
            </ToolbarGroup>
          }
          noDataState={
            <NoDataEmptyState
              // t('terms.stakeholders')
              title={t("composed.noDataStateTitle", {
                what: t("terms.stakeholders").toLowerCase(),
              })}
              // t('terms.stakeholder')
              description={
                t("composed.noDataStateBody", {
                  what: t("terms.stakeholder").toLowerCase(),
                }) + "."
              }
            />
          }
        />
      </ConditionalRender>

      <Modal
        // t('dialog.title.update')
        // t('dialog.title.new')
        // t('terms.stakeholder')
        title={t(`dialog.title.${stakeholderToUpdate ? "update" : "new"}`, {
          what: t("terms.stakeholder").toLowerCase(),
        })}
        variant={ModalVariant.medium}
        isOpen={isStakeholderModalOpen}
        onClose={closeStakeholderModal}
      >
        <StakeholderForm
          stakeholder={stakeholderToUpdate}
          onSaved={handleOnStakeholderFormSaved}
          onCancel={closeStakeholderModal}
        />
      </Modal>
    </>
  );
};
