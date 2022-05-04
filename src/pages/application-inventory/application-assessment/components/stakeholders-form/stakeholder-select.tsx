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
import { FieldHookConfig, useField } from "formik";

import {
  OptionWithValue,
  ISimpleSelectFetchProps,
  SimpleSelectFetch,
} from "shared/components";
import { Stakeholder } from "api/models";

const stakeholderToOption = (
  value: Stakeholder
): OptionWithValue<Stakeholder> => ({
  value,
  toString: () => value.displayName,
  props: {
    description: value.email,
  },
});

export interface IStakeholderSelectProps {
  fieldConfig: FieldHookConfig<number[]>;
  selectConfig: Omit<
    ISimpleSelectFetchProps,
    "value" | "onChange" | "onClear" | "options"
  >;
  stakeholders: Stakeholder[];
}

export const StakeholderSelect: React.FC<IStakeholderSelectProps> = ({
  fieldConfig,
  selectConfig,
  stakeholders,
}) => {
  const [field, , helpers] = useField(fieldConfig);

  return (
    <SimpleSelectFetch
      value={field.value
        .map((id) => stakeholders.find((f) => id === f.id))
        .map((e) => (e ? stakeholderToOption(e) : undefined))
        .filter((e) => e !== undefined)}
      options={stakeholders.map(stakeholderToOption)}
      onChange={(selection) => {
        const selectionWithValue = selection as OptionWithValue<Stakeholder>;
        const selectionId: number = selectionWithValue.value.id!;

        const currentValue = field.value || [];
        const e = currentValue.find((f) => f === selectionId);
        if (e) {
          helpers.setValue(currentValue.filter((f) => f !== selectionId));
        } else {
          helpers.setValue([...currentValue, selectionId]);
        }
      }}
      onClear={() => helpers.setValue([])}
      {...selectConfig}
    />
  );
};
