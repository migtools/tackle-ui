import React from "react";
import { AxiosError } from "axios";
import { FieldHookConfig, useField } from "formik";

import { Stakeholder } from "api/models";

import { SelectStakeholder } from "../select-stakeholder";

export interface SelectStakeholderFormFieldProps {
  stakeholders: Stakeholder[];
  isFetching: boolean;
  fetchError?: AxiosError;
}

export const SelectStakeholderFormField: React.FC<
  FieldHookConfig<Stakeholder | undefined> & SelectStakeholderFormFieldProps
> = ({ stakeholders, isFetching, fetchError, ...props }) => {
  const [field, , helpers] = useField(props);

  const handleOnSelect = (value: Stakeholder) => {
    helpers.setValue(value);
  };

  const handleOnClear = () => {
    helpers.setValue(undefined);
  };

  return (
    <SelectStakeholder
      value={field.value}
      stakeholders={stakeholders}
      isFetching={isFetching}
      fetchError={fetchError}
      onSelect={handleOnSelect}
      onClear={handleOnClear}
    />
  );
};
