import React from "react";
import { AxiosError } from "axios";
import { FieldHookConfig, useField } from "formik";

import { SelectStakeholder } from "shared/components";
import { Stakeholder } from "api/models";

export interface SelectStakeholderFormFieldProps {
  stakeholders: Stakeholder[];
  isFetching: boolean;
  fetchError?: AxiosError;
}

export const SelectStakeholderFormField: React.FC<
  FieldHookConfig<Stakeholder | undefined> & SelectStakeholderFormFieldProps
> = ({ stakeholders, isFetching, fetchError, ...props }) => {
  const [field, , helpers] = useField(props);

  const handleOnSelect = (value: Stakeholder | Stakeholder[]) => {
    if (Array.isArray(value)) {
      throw new Error("Component was expecting a value not an array");
    }

    helpers.setValue(value);
  };

  const handleOnClear = () => {
    helpers.setValue(undefined);
  };

  return (
    <SelectStakeholder
      placeholderText="Select owner from list of stakeholders"
      isMulti={false}
      value={field.value}
      stakeholders={stakeholders}
      isFetching={isFetching}
      fetchError={fetchError}
      onSelect={handleOnSelect}
      onClear={handleOnClear}
    />
  );
};
