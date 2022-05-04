/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from "react";
import { useTranslation } from "react-i18next";

import {
  Toolbar,
  ToolbarContent,
  ToolbarItem,
  ToolbarItemVariant,
  ToolbarToggleGroup,
} from "@patternfly/react-core";

import { FilterIcon } from "@patternfly/react-icons";

import { AppTable, IAppTableProps } from "../app-table/app-table";
import { SimplePagination } from "../simple-pagination";

export interface IAppTableWithControlsProps extends IAppTableProps {
  count: number;
  pagination: {
    perPage?: number;
    page?: number;
  };
  onPaginationChange: ({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }) => void;

  withoutTopPagination?: boolean;
  withoutBottomPagination?: boolean;

  toolbarBulkSelector?: any;
  toolbarToggle?: any;
  toolbarActions?: any;
  toolbarClearAllFilters?: () => void;
}

export const AppTableWithControls: React.FC<IAppTableWithControlsProps> = ({
  count,
  pagination,
  onPaginationChange,

  withoutTopPagination,
  withoutBottomPagination,

  toolbarBulkSelector,
  toolbarToggle,
  toolbarActions,
  toolbarClearAllFilters,

  ...rest
}) => {
  const { t } = useTranslation();

  return (
    <div style={{ backgroundColor: "var(--pf-global--BackgroundColor--100)" }}>
      <Toolbar
        className="pf-m-toggle-group-container"
        collapseListedFiltersBreakpoint="xl"
        clearAllFilters={toolbarClearAllFilters}
        clearFiltersButtonText={t("actions.clearAllFilters")}
      >
        <ToolbarContent>
          {toolbarBulkSelector}
          {toolbarToggle && (
            <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
              {toolbarToggle}
            </ToolbarToggleGroup>
          )}
          {toolbarActions}
          {!withoutTopPagination && (
            <ToolbarItem
              variant={ToolbarItemVariant.pagination}
              alignment={{ default: "alignRight" }}
            >
              <SimplePagination
                count={count}
                params={pagination}
                onChange={onPaginationChange}
                isTop={true}
              />
            </ToolbarItem>
          )}
        </ToolbarContent>
      </Toolbar>
      <AppTable {...rest} />
      {!withoutBottomPagination && (
        <SimplePagination
          count={count}
          params={pagination}
          onChange={onPaginationChange}
        />
      )}
    </div>
  );
};
