import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  ToolbarChip,
  ToolbarChipGroup,
  ToolbarFilter,
  ToolbarGroup,
} from "@patternfly/react-core";

import { useQueryString, useToolbarFilter } from "shared/hooks";

import { ChipBusinessService } from "../chip-business-service";
import { ChipTag } from "../chip-tag";

import { InputTextFilter } from "pages/application-inventory/application-list/components/toolbar-search-filter/input-text-filter";
import { SelectBusinessServiceFilter } from "pages/application-inventory/application-list/components/toolbar-search-filter/select-business-service-filter";
import { SelectTagFilter } from "pages/application-inventory/application-list/components/toolbar-search-filter/select-tag-filter";
import { AppTableToolbarToggleGroup } from "../app-table-toolbar-toggle-group";
import { ToolbarSearchFilter } from "pages/application-inventory/application-list/components/toolbar-search-filter";

enum FilterKey {
  NAME = "name",
  DESCRIPTION = "description",
  BUSINESS_SERVICE = "businessService",
  TAG = "tag",
}

export interface IApplicationsToolbarToggleGroupProps {}

export const ApplicationsToolbarToggleGroup: React.FC<IApplicationsToolbarToggleGroupProps> = ({}) => {
  // i18
  const { t } = useTranslation();

  // Router
  const [queryParams, updateParams] = useQueryString();

  // Toolbar filters
  const {
    filters: filtersValue,
    isPresent: areFiltersPresent,
    addFilter,
    setFilter,
    clearAllFilters,
  } = useToolbarFilter<ToolbarChip>(() => {
    const initialValue = new Map<FilterKey, ToolbarChip[]>();

    Object.keys(queryParams).forEach((key) => {
      const filterKey = key as FilterKey;
      switch (filterKey) {
        case FilterKey.NAME:
        case FilterKey.DESCRIPTION:
          initialValue.set(
            filterKey,
            queryParams[key].map((q) => ({ key: q, node: q }))
          );
          break;
        case FilterKey.BUSINESS_SERVICE:
          initialValue.set(
            filterKey,
            queryParams[key].map((elem) => ({
              key: elem,
              node: <ChipBusinessService id={elem} />,
            }))
          );
          break;
        case FilterKey.TAG:
          initialValue.set(
            filterKey,
            queryParams[key].map((elem) => ({
              key: elem,
              node: <ChipTag id={elem} />,
            }))
          );
          break;
      }
    });

    return initialValue;
  });

  useEffect(() => {
    const result: Record<string, string[]> = {};
    Array.from(filtersValue.entries()).forEach((entry) => {
      const filterKey = entry[0];
      const filterValue = entry[1];
      result[filterKey] = filterValue.map((f) => f.key);
    });
    updateParams(result);
  }, [filtersValue, updateParams]);

  // Filter components
  const filterOptions = [
    {
      key: FilterKey.NAME,
      name: t("terms.name"),
      input: (
        <InputTextFilter
          onApplyFilter={(filterText) => {
            addFilter(FilterKey.NAME, {
              key: filterText,
              node: filterText,
            });
          }}
        />
      ),
    },
    {
      key: FilterKey.DESCRIPTION,
      name: t("terms.description"),
      input: (
        <InputTextFilter
          onApplyFilter={(filterText) => {
            addFilter(FilterKey.DESCRIPTION, {
              key: filterText,
              node: filterText,
            });
          }}
        />
      ),
    },
    {
      key: FilterKey.BUSINESS_SERVICE,
      name: t("terms.businessService"),
      input: (
        <SelectBusinessServiceFilter
          value={filtersValue.get(FilterKey.BUSINESS_SERVICE)}
          onApplyFilter={(values) => {
            setFilter(FilterKey.BUSINESS_SERVICE, values);
          }}
        />
      ),
    },
    {
      key: FilterKey.TAG,
      name: t("terms.tag"),
      input: (
        <SelectTagFilter
          value={filtersValue.get(FilterKey.TAG)}
          onApplyFilter={(values) => setFilter(FilterKey.TAG, values)}
        />
      ),
    },
  ];

  return (
    <AppTableToolbarToggleGroup
      categories={filterOptions.map((f) => ({
        key: f.key,
        name: f.name,
      }))}
      chips={filtersValue}
      onChange={(key, value) => {
        setFilter(key, value as ToolbarChip[]);
      }}
    >
      <ToolbarSearchFilter filters={filterOptions} />
    </AppTableToolbarToggleGroup>
  );
};
