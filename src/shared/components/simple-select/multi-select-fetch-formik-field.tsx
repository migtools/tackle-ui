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

export interface IMultiSelectFetchFormikFieldProps {
  fieldConfig: FieldHookConfig<any>;
  selectConfig: Omit<ISimpleSelectFetchProps, "value" | "onChange" | "onClear">;
  isEqual: (a: any, b: any) => boolean;
}

export const MultiSelectFetchFormikField: React.FC<IMultiSelectFetchFormikFieldProps> = ({
  fieldConfig,
  selectConfig,
  isEqual,
}) => {
  const [field, , helpers] = useField(fieldConfig);

  return (
    <SimpleSelectFetch
      value={field.value}
      onChange={(selection) => {
        const currentValue = field.value || [];

        let nextValue: any[];
        const elementExists = currentValue.find((f: any) => {
          return isEqual(f, selection);
        });

        if (elementExists) {
          nextValue = currentValue.filter((f: any) => !isEqual(f, selection));
        } else {
          nextValue = [...currentValue, selection];
        }

        helpers.setValue(nextValue);
      }}
      onClear={() => helpers.setValue(undefined)}
      {...selectConfig}
    />
  );
};
