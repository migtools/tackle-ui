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

import { SelectVariant, ToolbarChip } from "@patternfly/react-core";
import { FilterIcon } from "@patternfly/react-icons";

import { OptionWithValue, SimpleSelect } from "shared/components";

import { RISK_LIST, DEFAULT_SELECT_MAX_HEIGHT } from "Constants";
import { Risk } from "api/models";
import { getToolbarChipKey } from "utils/utils";

export interface ISelectRiskFilterProps {
  value?: ToolbarChip[];
  onChange: (values: ToolbarChip[]) => void;
}

export const SelectRiskFilter: React.FC<ISelectRiskFilterProps> = ({
  value = [],
  onChange,
}) => {
  const { t } = useTranslation();

  const riskToToolbarChip = (value: Risk): ToolbarChip => {
    const risk = RISK_LIST[value];
    const label: string = risk ? t(risk.i18Key) : value;

    return {
      key: value,
      node: label,
    };
  };

  const riskToOption = (value: Risk): OptionWithValue<Risk> => {
    const risk = RISK_LIST[value];
    const label = risk ? t(risk.i18Key) : value;

    return {
      value,
      toString: () => label,
      compareTo: (selectOption: any) => {
        // If "string" we are just filtering
        if (typeof selectOption === "string") {
          return label.toLowerCase().includes(selectOption.toLowerCase());
        }
        // If not "string" we are selecting a checkbox
        else {
          return (
            selectOption.value &&
            (selectOption as OptionWithValue<Risk>).value === value
          );
        }
      },
    };
  };

  return (
    <SimpleSelect
      toggleIcon={<FilterIcon />}
      width={220}
      variant={SelectVariant.checkbox}
      aria-label="risk"
      aria-labelledby="risk"
      placeholderText={t("terms.risk")}
      maxHeight={DEFAULT_SELECT_MAX_HEIGHT}
      value={value
        .map((a) => {
          const risks: Risk[] = Object.keys(RISK_LIST) as Risk[];
          return risks.find((b) => getToolbarChipKey(a) === b);
        })
        .filter((f) => f !== undefined)
        .map((f) => riskToOption(f!))}
      options={Object.keys(RISK_LIST).map((k) => riskToOption(k as Risk))}
      onChange={(option) => {
        const optionValue = (option as OptionWithValue<Risk>).value;

        const elementExists = value.some(
          (f) => getToolbarChipKey(f) === optionValue
        );
        let newIds: ToolbarChip[];
        if (elementExists) {
          newIds = value.filter((f) => getToolbarChipKey(f) !== optionValue);
        } else {
          newIds = [...value, riskToToolbarChip(optionValue)];
        }

        onChange(newIds);
      }}
      hasInlineFilter
      onClear={() => onChange([])}
    />
  );
};
