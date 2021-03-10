import React from "react";
import { FieldHookConfig, useField } from "formik";
import { SelectOptionObject } from "@patternfly/react-core";

import { SelectEntity, SelectEntityProps } from "./select-entity";

type ExcludeProps<T, Y> = Pick<T, Exclude<keyof T, keyof Y>>;

/**
 * Properties that will be implemented in this component and will not come from outside
 */
interface OverridedSelectProps {
  onSelect?: (
    event: React.MouseEvent | React.ChangeEvent,
    value: string | SelectOptionObject,
    isPlaceholder?: boolean
  ) => void;
  onClear?: (event: React.MouseEvent) => void;
}

//

type FieldConfig = FieldHookConfig<
  SelectOptionObject | SelectOptionObject[] | undefined
>;
type SelectConfigProps = ExcludeProps<SelectEntityProps, OverridedSelectProps>;

export interface SelectEntityFormikFieldProps {
  fieldConfig: FieldConfig;
  selectConfig: SelectConfigProps;
}

export const SelectEntityFormikField: React.FC<SelectEntityFormikFieldProps> = ({
  fieldConfig,
  selectConfig,
}) => {
  const [field, , helpers] = useField(fieldConfig);

  const handleOnSelect = (value: SelectOptionObject | SelectOptionObject[]) => {
    helpers.setValue(value);
  };

  const handleOnClear = () => {
    if (selectConfig.isMulti) {
      helpers.setValue([]);
    } else {
      helpers.setValue(undefined);
    }
  };

  return (
    <SelectEntity
      value={field.value}
      onSelect={handleOnSelect}
      onClear={handleOnClear}
      {...selectConfig}
    />
  );
};
