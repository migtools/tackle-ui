import React, { useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getIdentities } from "@app/api/rest";
import {
  Button,
  Checkbox,
  Modal,
  PageSection,
  PageSectionVariants,
  Pagination,
  Text,
  TextContent,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  cellWidth,
  expandable,
  ICell,
  IRow,
  IRowData,
  sortable,
  Table,
  TableBody,
  TableHeader,
  TableText,
} from "@patternfly/react-table";
import { PencilAltIcon } from "@patternfly/react-icons/dist/esm/icons/pencil-alt-icon";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";

import {
  FilterToolbar,
  FilterType,
  FilterCategory,
} from "@app/shared/components/FilterToolbar";
import { NoDataEmptyState } from "@app/shared/components";
import { Identity } from "@app/api/models";
import { useFilterState } from "@app/shared/hooks/useFilterState";
import { usePaginationState } from "@app/shared/hooks/usePaginationState";
import { useSortState } from "@app/shared/hooks/useSortState";
import { useFetch } from "@app/shared/hooks/useFetch";
import { IdentityPageMapper } from "@app/api/apiUtils";
import { useEntityModal } from "@app/shared/hooks/useEntityModal";
import { ApplicationsIdentityForm } from "../application-inventory/application-list/components/ApplicationsIdentityForm";
import { IdentityForm } from "./components/identity-form";
import { AxiosResponse } from "axios";
import { useDispatch } from "react-redux";
import { alertActions } from "@app/store/alert";

const ENTITY_FIELD = "entity";

const getRow = (rowData: IRowData): Identity => {
  return rowData[ENTITY_FIELD];
};

export const Identities: React.FunctionComponent = () => {
  const { t } = useTranslation();

  // Redux
  const dispatch = useDispatch();

  // Create and update modal
  const {
    isOpen: isIdentityModalOpen,
    data: identityToUpdate,
    create: openCreateIdentityModal,
    update: openUpdateIdentityModal,
    close: closeIdentityModal,
  } = useEntityModal<Identity>();

  /** fetch identities
   *
   *
   *
   *
   */

  const fetchIdentities = useCallback(() => {
    return getIdentities();
    /**
     * TODO: update deps array when filter values change
     */
  }, []);

  const {
    data: page,
    isFetching,
    fetchError,
    requestFetch: refreshTable,
  } = useFetch<Array<any>>({
    defaultIsFetching: true,
    onFetch: fetchIdentities,
  });

  const identities = useMemo(() => {
    return page !== undefined ? page : undefined;
  }, [page]);

  const onIdentityModalSaved = (response: AxiosResponse<Identity>) => {
    if (!identityToUpdate) {
      dispatch(
        alertActions.addSuccess(
          t("toastr.success.added", {
            what: response.data.name,
            type: t("terms.identity").toLowerCase(),
          })
        )
      );
    }

    closeIdentityModal();
    refreshTable();
  };

  const filterCategories: FilterCategory<Identity>[] = [
    {
      key: "name",
      title: "Name",
      type: FilterType.search,
      placeholderText: "Filter by name...",
      getItemValue: (item) => {
        return item.name;
      },
    },
    {
      key: "type",
      title: "Type",
      type: FilterType.select,
      placeholderText: "Filter by type...",
      selectOptions: [
        { key: "scm", value: "Source Control" },
        { key: "mvn", value: "Maven Settings File" },
      ],
      getItemValue: (item) => {
        return item.kind ? "Warm" : "Cold";
      },
    },
    {
      key: "createUser",
      title: "Created By",
      type: FilterType.search,
      placeholderText: "Filter by created by...",
      getItemValue: (item) => {
        return item.createUser;
      },
    },
  ];

  const { filterValues, setFilterValues, filteredItems } = useFilterState(
    identities || [],
    filterCategories
  );
  const getSortValues = (identity: Identity) => [
    identity.name,
    identity.kind,
    identity.createUser,
    "", // Action column
  ];

  const { sortBy, onSort, sortedItems } = useSortState(
    filteredItems,
    getSortValues
  );
  const { currentPageItems, setPageNumber, paginationProps } =
    usePaginationState(sortedItems, 10);

  useEffect(() => {
    refreshTable();
  }, [refreshTable]);

  const columns: ICell[] = [
    {
      title: t("terms.name"),
      transforms: [sortable, cellWidth(20)],
      cellFormatters: [expandable],
    },
    { title: t("terms.description"), transforms: [cellWidth(25)] },
    { title: t("terms.type"), transforms: [sortable, cellWidth(20)] },
    { title: t("terms.createdBy"), transforms: [sortable, cellWidth(10)] },
    {
      title: "",
      props: {
        className: "pf-c-table__inline-edit-action",
      },
    },
  ];

  const rows: IRow[] = [];
  currentPageItems?.forEach((item: Identity) => {
    rows.push({
      [ENTITY_FIELD]: item,
      cells: [
        {
          title: <TableText wrapModifier="truncate">{item.name}</TableText>,
        },
        {
          title: (
            <TableText wrapModifier="truncate">{item.description}</TableText>
          ),
        },
        {
          title: <TableText wrapModifier="truncate">{item.kind} </TableText>,
        },
        {
          title: (
            <TableText wrapModifier="truncate">{item.createUser} </TableText>
          ),
        },
        {
          title: (
            <div className="pf-c-inline-edit__action pf-m-enable-editable">
              <Button
                type="button"
                variant="plain"
                onClick={() => openUpdateIdentityModal(item)}
              >
                <PencilAltIcon />
              </Button>
            </div>
          ),
        },
      ],
    });
  });

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{t("terms.credentials")}</Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <FilterToolbar<Identity>
          filterCategories={filterCategories}
          filterValues={filterValues}
          setFilterValues={setFilterValues}
          endToolbarItems={
            <>
              <ToolbarItem>
                <Button
                  isSmall
                  onClick={openCreateIdentityModal}
                  variant="primary"
                  id="create-credential-button"
                >
                  {t("actions.createNew")}
                </Button>
              </ToolbarItem>
            </>
          }
          pagination={
            <Pagination
              className={spacing.mtMd}
              {...paginationProps}
              widgetId="plans-table-pagination-top"
            />
          }
        />
        <Modal
          // t('dialog.title.update')
          // t('dialog.title.new')
          // t('terms.application')
          title={t(`dialog.title.${identityToUpdate ? "update" : "new"}`, {
            what: t("terms.identity").toLowerCase(),
          })}
          variant="medium"
          isOpen={isIdentityModalOpen}
          onClose={closeIdentityModal}
        >
          <IdentityForm
            identity={identityToUpdate}
            onSaved={onIdentityModalSaved}
            onCancel={closeIdentityModal}
          />
        </Modal>

        {identities && identities?.length > 0 ? (
          <Table
            aria-label="Credentials table"
            cells={columns}
            rows={rows}
            sortBy={sortBy}
            onSort={onSort}
          >
            <TableHeader />
            <TableBody />
          </Table>
        ) : (
          <NoDataEmptyState
            title={t("composed.noDataStateTitle", {
              what: t("terms.credentials").toLowerCase(),
            })}
            description={
              t("composed.noDataStateBody", {
                what: t("terms.credential").toLowerCase(),
              }) + "."
            }
          />
        )}
        <Pagination
          {...paginationProps}
          widgetId="plans-table-pagination-bottom"
          variant="bottom"
        />
      </PageSection>
    </>
  );
};
