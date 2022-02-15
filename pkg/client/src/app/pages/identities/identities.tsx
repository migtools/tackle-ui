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
  sortable,
  Table,
  TableBody,
  TableHeader,
} from "@patternfly/react-table";
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
    return page !== undefined && page.length === 0 ? page : undefined;
  }, [page]);

  useEffect(() => {
    refreshTable();
    console.log("what is data", page);
  }, [
    // filtersValue,
    // paginationQuery,
    // sortByQuery,
    // isWatchingBulkCopy,
    refreshTable,
  ]);

  const onIdentityModalSaved = (response: AxiosResponse<Identity>) => {
    if (!identityToUpdate) {
      dispatch(
        alertActions.addSuccess(
          // t('terms.application')
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
  ];

  const { filterValues, setFilterValues, filteredItems } = useFilterState(
    identities || [],
    filterCategories
  );
  const getSortValues = (identity: Identity) => [
    "", // Expand/collapse column
    identity.name,
    identity.kind,
    "", // Action column
  ];

  const { sortBy, onSort, sortedItems } = useSortState(
    filteredItems,
    getSortValues
  );
  const { currentPageItems, setPageNumber, paginationProps } =
    usePaginationState(sortedItems, 10);

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
            what: t("terms.application").toLowerCase(),
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
            // className="credential-table"
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
