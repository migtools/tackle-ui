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
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { SelectVariant, ToolbarChip } from "@patternfly/react-core";

import { SimpleSelectFetch, OptionWithValue } from "shared/components";
import { useFetchBusinessServices } from "shared/hooks";

import { BusinessService } from "api/models";
import { DEFAULT_SELECT_MAX_HEIGHT } from "Constants";

const businessServiceToToolbarChip = (value: BusinessService): ToolbarChip => ({
  key: `${value.id}`,
  node: value.name,
});

const businessServiceToOption = (
  value: BusinessService
): OptionWithValue<BusinessService> => ({
  value,
  toString: () => value.name,
  compareTo: (selectOption: any) => {
    // If "string" we are just filtering
    if (typeof selectOption === "string") {
      return value.name.toLowerCase().includes(selectOption.toLowerCase());
    }
    // If not "string" we are selecting a checkbox
    else {
      return (
        selectOption.value &&
        (selectOption as OptionWithValue<BusinessService>).value.id === value.id
      );
    }
  },
});

export interface BusinessServiceFilterProps {
  value?: ToolbarChip[];
  onApplyFilter: (values: ToolbarChip[]) => void;
}

export const SelectBusinessServiceFilter: React.FC<BusinessServiceFilterProps> = ({
  value = [],
  onApplyFilter,
}) => {
  const { t } = useTranslation();

  const {
    businessServices,
    isFetching: isFetchingBusinessServices,
    fetchError: fetchErrorBusinessServices,
    fetchAllBusinessServices,
  } = useFetchBusinessServices();

  useEffect(() => {
    fetchAllBusinessServices();
  }, [fetchAllBusinessServices]);

  return (
    <SimpleSelectFetch
      variant={SelectVariant.checkbox}
      aria-label="business-service"
      aria-labelledby="business-service"
      placeholderText={t("terms.businessService")}
      maxHeight={DEFAULT_SELECT_MAX_HEIGHT}
      value={value
        .map((f) =>
          (businessServices?.data || []).find((b) => `${b.id}` === f.key)
        )
        .map((f) => businessServiceToOption(f!))}
      options={(businessServices?.data || []).map(businessServiceToOption)}
      onChange={(option) => {
        const optionValue = (option as OptionWithValue<BusinessService>).value;

        const elementExists = value.some((f) => f.key === `${optionValue.id}`);
        let newIds: ToolbarChip[];
        if (elementExists) {
          newIds = value.filter((f) => f.key !== `${optionValue.id}`);
        } else {
          newIds = [...value, businessServiceToToolbarChip(optionValue)];
        }

        onApplyFilter(newIds);
      }}
      isFetching={isFetchingBusinessServices}
      fetchError={fetchErrorBusinessServices}
      hasInlineFilter
      onClear={() => onApplyFilter([])}
    />
  );
};
