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

import { ToolbarChip } from "@patternfly/react-core";

import {
  SelectBusinessServiceFilter,
  SelectTagFilter,
} from "shared/containers";
import { ApplicationFilterKey } from "Constants";

import { AppTableToolbarToggleGroup } from "../app-table-toolbar-toggle-group";
import { ToolbarSearchFilter } from "../toolbar-search-filter";
import { InputTextFilter } from "../input-text-filter";

export interface IApplicationToolbarToggleGroupProps {
  value: Map<ApplicationFilterKey, ToolbarChip[]>;
  addFilter: (key: ApplicationFilterKey, value: ToolbarChip) => void;
  setFilter: (key: ApplicationFilterKey, value: ToolbarChip[]) => void;
}

export const ApplicationToolbarToggleGroup: React.FC<IApplicationToolbarToggleGroupProps> = ({
  value,
  addFilter,
  setFilter,
}) => {
  // i18
  const { t } = useTranslation();

  // Filter components
  const filterOptions = [
    {
      key: ApplicationFilterKey.NAME,
      name: t("terms.name"),
      input: (
        <InputTextFilter
          onApplyFilter={(filterText) => {
            addFilter(ApplicationFilterKey.NAME, {
              key: filterText,
              node: filterText,
            });
          }}
        />
      ),
    },
    {
      key: ApplicationFilterKey.DESCRIPTION,
      name: t("terms.description"),
      input: (
        <InputTextFilter
          onApplyFilter={(filterText) => {
            addFilter(ApplicationFilterKey.DESCRIPTION, {
              key: filterText,
              node: filterText,
            });
          }}
        />
      ),
    },
    {
      key: ApplicationFilterKey.BUSINESS_SERVICE,
      name: t("terms.businessService"),
      input: (
        <SelectBusinessServiceFilter
          value={value.get(ApplicationFilterKey.BUSINESS_SERVICE)}
          onApplyFilter={(values) => {
            setFilter(ApplicationFilterKey.BUSINESS_SERVICE, values);
          }}
        />
      ),
    },
    {
      key: ApplicationFilterKey.TAG,
      name: t("terms.tag"),
      input: (
        <SelectTagFilter
          value={value.get(ApplicationFilterKey.TAG)}
          onApplyFilter={(values) =>
            setFilter(ApplicationFilterKey.TAG, values)
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
        setFilter(key as ApplicationFilterKey, value as ToolbarChip[]);
      }}
    >
      <ToolbarSearchFilter filters={filterOptions} />
    </AppTableToolbarToggleGroup>
  );
};
