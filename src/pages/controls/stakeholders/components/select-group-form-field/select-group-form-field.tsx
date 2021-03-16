import React from "react";
import { AxiosError } from "axios";
import { FieldHookConfig, useField } from "formik";

import { StakeholderGroup } from "api/models";

import { SelectGroup } from "../select-group";

export interface SelectMemberFormFieldProps {
  stakeholderGroups: StakeholderGroup[];
  isFetching: boolean;
  fetchError?: AxiosError;
}

export const SelectGroupFormField: React.FC<
  FieldHookConfig<StakeholderGroup[] | undefined> & SelectMemberFormFieldProps
> = ({
  stakeholderGroups: stakeholderGroups,
  isFetching,
  fetchError,
  ...props
}) => {
  const [field, , helpers] = useField(props);

  const handleOnSelect = (value: StakeholderGroup[]) => {
    helpers.setValue(value);
  };

  const handleOnClear = () => {
    helpers.setValue(undefined);
  };

  return (
    <SelectGroup
      value={field.value}
      stakeholderGroups={stakeholderGroups}
      isFetching={isFetching}
      fetchError={fetchError}
      onSelect={handleOnSelect}
      onClear={handleOnClear}
    />
  );
};
