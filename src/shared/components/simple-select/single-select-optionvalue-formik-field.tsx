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
  ISimpleSelectProps,
  OptionWithValue,
  SimpleSelect,
} from "./simple-select";

export interface ISingleSelectOptionValueFormikFieldProps<T> {
  fieldConfig: FieldHookConfig<T | null>;
  selectConfig: Omit<
    ISimpleSelectProps,
    "value" | "options" | "onChange" | "onClear"
  >;
  options: T[];
  toOptionWithValue: (option: T) => OptionWithValue<T>;
}

export const SingleSelectOptionValueFormikField = <T extends any>({
  fieldConfig,
  selectConfig,
  options,
  toOptionWithValue,
}: ISingleSelectOptionValueFormikFieldProps<T>) => {
  const [field, , helpers] = useField(fieldConfig);

  return (
    <SimpleSelect
      value={field.value ? toOptionWithValue(field.value) : undefined}
      options={options.map(toOptionWithValue)}
      onChange={(selection) => {
        const selectionValue = (selection as OptionWithValue<T>).value;
        helpers.setValue(selectionValue);
      }}
      onClear={() => helpers.setValue(null)}
      {...selectConfig}
    />
  );
};
