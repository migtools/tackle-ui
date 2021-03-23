import React from "react";
import { FieldHookConfig, useField } from "formik";

import {
  ISimpleSelectFetchProps,
  SimpleSelectFetch,
} from "./simple-select-fetch";

export interface ISimpleSelectFetchFormikFieldProps {
  fieldConfig: FieldHookConfig<any>;
  selectConfig: Omit<ISimpleSelectFetchProps, "value" | "onClear">;
}

export const SimpleSelectFetchFormikField: React.FC<ISimpleSelectFetchFormikFieldProps> = ({
  fieldConfig,
  selectConfig,
}) => {
  const [field, , helpers] = useField(fieldConfig);

  return (
    <SimpleSelectFetch
      value={field.value}
      onClear={() => helpers.setValue(undefined)}
      {...selectConfig}
    />
  );
};
