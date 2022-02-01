import React from "react";
import { useTranslation } from "react-i18next";

import { ToolbarChip } from "@patternfly/react-core";

import {
  SelectBusinessServiceFilter,
  SelectTagFilter,
} from "@app/shared/containers";
import { IdentityFilterKey } from "@app/Constants";

import { AppTableToolbarToggleGroup } from "@app/shared/components/app-table-toolbar-toggle-group";
import { ToolbarSearchFilter } from "@app/shared/components/toolbar-search-filter";
import { InputTextFilter } from "@app/shared/components/input-text-filter";

export interface IApplicationToolbarToggleGroupProps {
  value: Map<IdentityFilterKey, ToolbarChip[]>;
  addFilter: (key: IdentityFilterKey, value: ToolbarChip) => void;
  setFilter: (key: IdentityFilterKey, value: ToolbarChip[]) => void;
}

export const IdentityToolbarToggleGroup: React.FC<
  IApplicationToolbarToggleGroupProps
> = ({ value, addFilter, setFilter }) => {
  const { t } = useTranslation();

  const filterOptions = [
    {
      key: IdentityFilterKey.NAME,
      name: t("terms.name"),
      input: (
        <InputTextFilter
          onApplyFilter={(filterText) => {
            addFilter(IdentityFilterKey.NAME, {
              key: filterText,
              node: filterText,
            });
          }}
        />
      ),
    },
    {
      key: IdentityFilterKey.DESCRIPTION,
      name: t("terms.description"),
      input: (
        <InputTextFilter
          onApplyFilter={(filterText) => {
            addFilter(IdentityFilterKey.DESCRIPTION, {
              key: filterText,
              node: filterText,
            });
          }}
        />
      ),
    },
    {
      key: IdentityFilterKey.KIND,
      name: t("terms.type"),
      input: (
        <SelectBusinessServiceFilter
          value={value.get(IdentityFilterKey.KIND)}
          onApplyFilter={(values) => {
            setFilter(IdentityFilterKey.KIND, values);
          }}
        />
      ),
    },
    {
      key: IdentityFilterKey.CREATEDBY,
      name: t("terms.createdBy"),
      input: (
        <SelectTagFilter
          value={value.get(IdentityFilterKey.CREATEDBY)}
          onApplyFilter={(values) =>
            setFilter(IdentityFilterKey.CREATEDBY, values)
          }
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
      chips={value}
      onChange={(key, value) => {
        setFilter(key as IdentityFilterKey, value as ToolbarChip[]);
      }}
    >
      <ToolbarSearchFilter filters={filterOptions} />
    </AppTableToolbarToggleGroup>
  );
};
