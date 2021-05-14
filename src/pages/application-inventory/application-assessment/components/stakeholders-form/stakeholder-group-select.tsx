import React from "react";
import { FieldHookConfig, useField } from "formik";
import { useTranslation } from "react-i18next";

import {
  OptionWithValue,
  ISimpleSelectFetchProps,
  SimpleSelectFetch,
} from "shared/components";
import { StakeholderGroup } from "api/models";

const stakeholderGroupToOption = (
  value: StakeholderGroup
): OptionWithValue<StakeholderGroup> => ({
  value,
  toString: () => value.name,
});

export interface IStakeholderGroupSelectProps {
  fieldConfig: FieldHookConfig<number[]>;
  selectConfig: Omit<
    ISimpleSelectFetchProps,
    "value" | "onChange" | "onClear" | "options"
  >;
  stakeholderGroups: StakeholderGroup[];
}

export const StakeholderGroupSelect: React.FC<IStakeholderGroupSelectProps> = ({
  fieldConfig,
  selectConfig,
  stakeholderGroups,
}) => {
  const [field, , helpers] = useField(fieldConfig);
  const { t } = useTranslation();

  const buildUnknownStakeholder = (id: number) => {
    const result: StakeholderGroup = {
      id,
      name: t("terms.unknown"),
    };
    return result;
  };

  return (
    <SimpleSelectFetch
      value={field.value
        .map((id) => {
          const e = stakeholderGroups.find((f) => id === f.id);
          return e || buildUnknownStakeholder(id);
        })
        .map(stakeholderGroupToOption)}
      options={stakeholderGroups.map(stakeholderGroupToOption)}
      onChange={(selection) => {
        const selectionWithValue = selection as OptionWithValue<StakeholderGroup>;
        const selectionId: number = selectionWithValue.value.id!;

        const currentValue = field.value || [];
        const e = currentValue.find((f) => f === selectionId);
        if (e) {
          helpers.setValue(currentValue.filter((f) => f !== selectionId));
        } else {
          helpers.setValue([...currentValue, selectionId]);
        }
      }}
      onClear={() => helpers.setValue([])}
      {...selectConfig}
    />
  );
};
