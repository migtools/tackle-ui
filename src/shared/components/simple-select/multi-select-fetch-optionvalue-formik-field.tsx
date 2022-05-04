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
  ISimpleSelectFetchProps,
  SimpleSelectFetch,
} from "./simple-select-fetch";
import { OptionWithValue } from "./simple-select";

export interface IMultiSelectFetchOptionValueFormikFieldProps<T> {
  fieldConfig: FieldHookConfig<T[]>;
  selectConfig: Omit<
    ISimpleSelectFetchProps,
    "value" | "options" | "onChange" | "onClear"
  >;
  options: T[];
  toOptionWithValue: (option: T) => OptionWithValue<T>;
  isEqual: (a: T, b: T) => boolean;
}

export const MultiSelectFetchOptionValueFormikField = <T extends any>({
  fieldConfig,
  selectConfig,
  options,
  toOptionWithValue,
  isEqual,
}: IMultiSelectFetchOptionValueFormikFieldProps<T>) => {
  const [field, , helpers] = useField(fieldConfig);

  return (
    <SimpleSelectFetch
      value={field.value.map(toOptionWithValue)}
      options={options.map(toOptionWithValue)}
      onChange={(selection) => {
        const selectionValue = (selection as OptionWithValue<T>).value;

        const currentValue = field.value;

        let nextValue: T[];
        const elementExists = currentValue.find((f: T) => {
          return isEqual(f, selectionValue);
        });

        if (elementExists) {
          nextValue = currentValue.filter(
            (f: T) => !isEqual(f, selectionValue)
          );
        } else {
          nextValue = [...currentValue, selectionValue];
        }

        helpers.setValue(nextValue);
      }}
      onClear={() => helpers.setValue([])}
      {...selectConfig}
    />
  );
};
