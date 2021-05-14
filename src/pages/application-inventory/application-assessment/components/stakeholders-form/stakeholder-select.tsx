import React from "react";
import { FieldHookConfig, useField } from "formik";
import { useTranslation } from "react-i18next";

import {
  OptionWithValue,
  ISimpleSelectFetchProps,
  SimpleSelectFetch,
} from "shared/components";
import { Stakeholder } from "api/models";

const stakeholderToOption = (
  value: Stakeholder
): OptionWithValue<Stakeholder> => ({
  value,
  toString: () => value.displayName,
});

export interface IStakeholderSelectProps {
  fieldConfig: FieldHookConfig<number[]>;
  selectConfig: Omit<
    ISimpleSelectFetchProps,
    "value" | "onChange" | "onClear" | "options"
  >;
  stakeholders: Stakeholder[];
}

export const StakeholderSelect: React.FC<IStakeholderSelectProps> = ({
  fieldConfig,
  selectConfig,
  stakeholders,
}) => {
  const [field, , helpers] = useField(fieldConfig);
  const { t } = useTranslation();

  const buildUnknownStakeholder = (id: number) => {
    const result: Stakeholder = {
      id,
      displayName: t("terms.unknown"),
      email: t("terms.unknown"),
    };
    return result;
  };

  return (
    <SimpleSelectFetch
      value={field.value
        .map((id) => {
          const e = stakeholders.find((f) => id === f.id);
          return e || buildUnknownStakeholder(id);
        })
        .map(stakeholderToOption)}
      options={stakeholders.map(stakeholderToOption)}
      onChange={(selection) => {
        const selectionWithValue = selection as OptionWithValue<Stakeholder>;
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
