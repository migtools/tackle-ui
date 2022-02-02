import React, { useCallback, useMemo } from "react";
import {
  AppPlaceholder,
  AppTableWithControls,
  ConditionalRender,
  NoDataEmptyState,
} from "@app/shared/components";
import {
  Button,
  ButtonVariant,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
  ToolbarChip,
  ToolbarGroup,
  ToolbarItem,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import {
  cellWidth,
  expandable,
  ICell,
  IRow,
  sortable,
} from "@patternfly/react-table";

import { IdentityPageMapper } from "@app/api/apiUtils";
import { IdentityPage, SortByQuery } from "@app/api/models";
import {
  useApplicationToolbarFilter,
  useFetch,
  useTableControls,
} from "@app/shared/hooks";
import {
  getIdentities,
  IdentitySortBy,
  IdentitySortByQuery,
} from "@app/api/rest";
import { IdentityFilterKey } from "@app/Constants";
import { IdentityToolbarToggleGroup } from "./identity-toolbar-toggle-group";

const toSortByQuery = (
  sortBy?: SortByQuery
): IdentitySortByQuery | undefined => {
  if (!sortBy) {
    return undefined;
  }

  let field: IdentitySortBy;
  switch (sortBy.index) {
    case 2:
      field = IdentitySortBy.NAME;
      break;
    case 6:
      field = IdentitySortBy.KIND;
      break;
    case 7:
      field = IdentitySortBy.CREATEDBY;
      break;
    default:
      return undefined;
  }

  return {
    field,
    direction: sortBy.direction,
  };
};
export const Identities: React.FunctionComponent = () => {
  // i18
  const { t } = useTranslation();

  // // Redux
  // const dispatch = useDispatch();

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

  const fetchIdentities = useCallback(() => {
    const nameVal = filtersValue.get(IdentityFilterKey.NAME);
    const descriptionVal = filtersValue.get(IdentityFilterKey.DESCRIPTION);
    const kindVal = filtersValue.get(IdentityFilterKey.KIND);
    const createdByVal = filtersValue.get(IdentityFilterKey.CREATEDBY);
    return getIdentities(
      {
        name: nameVal?.map((f) => f.key),
        description: descriptionVal?.map((f) => f.key),
        kind: kindVal?.map((f) => f.key),
        createdBy: createdByVal?.map((f) => f.key),
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
  } = useFetch<IdentityPage>({
    defaultIsFetching: true,
    onFetch: fetchIdentities,
  });

  const identities = useMemo(() => {
    return page ? IdentityPageMapper(page) : undefined;
  }, [page]);

  React.useEffect(() => {
    refreshTable();
  }, [filtersValue, paginationQuery, sortByQuery, refreshTable]);

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
        <ConditionalRender
          when={isFetching && !(identities || fetchError)}
          then={<AppPlaceholder />}
        >
          <AppTableWithControls
            count={identities ? identities.meta.count : 0}
            pagination={paginationQuery}
            sortBy={sortByQuery}
            onPaginationChange={handlePaginationChange}
            onSort={handleSortChange}
            // onCollapse={collapseRow}
            // onSelect={selectRow}
            canSelectAll={false}
            cells={columns}
            rows={rows}
            // actionResolver={actionResolver}
            isLoading={isFetching}
            loadingVariant="skeleton"
            fetchError={fetchError}
            toolbarClearAllFilters={clearAllFilters}
            filtersApplied={areFiltersPresent}
            toolbarToggle={
              <IdentityToolbarToggleGroup
                value={filtersValue as Map<IdentityFilterKey, ToolbarChip[]>}
                addFilter={addFilter}
                setFilter={setFilter}
              />
            }
            toolbarActions={
              <>
                <ToolbarGroup variant="button-group">
                  <ToolbarItem>
                    <Button
                      type="button"
                      aria-label="create-application"
                      variant={ButtonVariant.primary}
                      // onClick={openCreateApplicationModal}
                    >
                      {t("actions.createNew")}
                    </Button>
                  </ToolbarItem>
                </ToolbarGroup>
              </>
            }
            noDataState={
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
            }
          />
        </ConditionalRender>
      </PageSection>
    </>
  );
};
