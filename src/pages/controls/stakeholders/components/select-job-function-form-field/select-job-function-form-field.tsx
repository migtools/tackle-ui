import React from "react";
import { AxiosError } from "axios";
import { FieldHookConfig, useField } from "formik";

import { JobFunction } from "api/models";

import { SelectJobFunction } from "../select-job-function";

export interface SelectJobFunctionFormFieldProps {
  jobFunctions: JobFunction[];
  isFetching: boolean;
  fetchError?: AxiosError;
}

export const SelectJobFunctionFormField: React.FC<
  FieldHookConfig<JobFunction | undefined> & SelectJobFunctionFormFieldProps
> = ({ jobFunctions, isFetching, fetchError, ...props }) => {
  const [field, , helpers] = useField(props);

  const handleOnSelect = (value: JobFunction) => {
    helpers.setValue(value);
  };

  const handleOnClear = () => {
    helpers.setValue(undefined);
  };

  return (
    <SelectJobFunction
      value={field.value}
      jobFunctions={jobFunctions}
      isFetching={isFetching}
      fetchError={fetchError}
      onSelect={handleOnSelect}
      onClear={handleOnClear}
    />
  );
};
