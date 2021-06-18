import React, { useCallback, useEffect } from "react";

import { PageSection, Text } from "@patternfly/react-core";

import {
  useApplicationToolbarFilter,
  useFetch,
  useTableControls,
} from "shared/hooks";
import { PageHeader } from "shared/components";

import { Paths } from "Paths";
import { getApplicationImportSummary } from "api/rest";

export const ApplicationReview: React.FC = () => {
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
    return getApplicationImportSummary();
  }, [filtersValue, paginationQuery, sortByQuery]);

  const {
    data: page,
    isFetching,
    fetchError,
    requestFetch: refreshTable,
  } = useFetch<any>({
    defaultIsFetching: true,
    onFetch: fetchApplications,
  });

  // const applications = useMemo(() => {
  //   return page ? applicationPageMapper(page) : undefined;
  // }, [page]);

  useEffect(() => {
    refreshTable();
  }, [filtersValue, paginationQuery, sortByQuery, refreshTable]);

  useEffect(() => {
    console.log(page);
  }, [page]);

  return (
    <>
      <PageSection variant="light">
        <PageHeader
          title="Application imports"
          breadcrumbs={[
            {
              title: "Applications",
              path: Paths.applicationInventory_applicationList,
            },
            {
              title: "Application imports",
              path: "",
            },
          ]}
          menuActions={[]}
        />
      </PageSection>
      <PageSection>hola</PageSection>
    </>
  );
};
