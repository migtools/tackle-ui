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

  toolbar?: any;
  toolbarToggle?: any;
  toolbarClearAllFilters?: () => void;
}

export const AppTableWithControls: React.FC<IAppTableWithControlsProps> = ({
  count,
  pagination,
  onPaginationChange,

  toolbar,
  toolbarToggle,
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
          {toolbarToggle && (
            <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
              {toolbarToggle}
            </ToolbarToggleGroup>
          )}
          {toolbar}
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
        </ToolbarContent>
      </Toolbar>
      <AppTable {...rest} />
      <SimplePagination
        count={count}
        params={pagination}
        onChange={onPaginationChange}
      />
    </div>
  );
};
