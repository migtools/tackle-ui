import React from "react";
import { AxiosError } from "axios";
import { FieldHookConfig, useField } from "formik";

import { Stakeholder } from "api/models";

import { SelectMember } from "../select-member";

export interface SelectMemberFormFieldProps {
  stakeholders: Stakeholder[];
  isFetching: boolean;
  fetchError?: AxiosError;
}

export const SelectMemberFormField: React.FC<
  FieldHookConfig<Stakeholder[] | undefined> & SelectMemberFormFieldProps
> = ({ stakeholders, isFetching, fetchError, ...props }) => {
  const [field, , helpers] = useField(props);

  const handleOnSelect = (value: Stakeholder[]) => {
    helpers.setValue(value);
  };

  const handleOnClear = () => {
    helpers.setValue(undefined);
  };

  return (
    <SelectMember
      value={field.value}
      stakeholders={stakeholders}
      isFetching={isFetching}
      fetchError={fetchError}
      onSelect={handleOnSelect}
      onClear={handleOnClear}
    />
  );
};
