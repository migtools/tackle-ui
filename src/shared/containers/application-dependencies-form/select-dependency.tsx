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
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

import { OptionWithValue, SimpleSelectFetch } from "shared/components";

import { DEFAULT_SELECT_MAX_HEIGHT } from "Constants";
import {
  createApplicationDependency,
  deleteApplicationDependency,
} from "api/rest";
import { ApplicationDependency } from "api/models";

const isEqual = (
  a: OptionWithValue<ApplicationDependency>,
  b: OptionWithValue<ApplicationDependency>
) => {
  return (
    (a.value.id && b.value.id && a.value.id === b.value.id) ||
    (a.value.from.id === b.value.from.id && a.value.to.id === b.value.to.id)
  );
};

const dependencyToOption = (
  value: ApplicationDependency,
  toStringFn: (value: ApplicationDependency) => string
): OptionWithValue<ApplicationDependency> => ({
  value,
  toString: () => toStringFn(value),
});

export interface SelectDependencyProps {
  fieldId: string;
  toStringFn: (value: ApplicationDependency) => string;

  value: OptionWithValue<ApplicationDependency>[];
  setValue: (value: OptionWithValue<ApplicationDependency>[]) => void;
  options: OptionWithValue<ApplicationDependency>[];

  isFetching: boolean;
  fetchError?: AxiosError;

  isSaving: boolean;
  setIsSaving: (value: boolean) => void;
  saveError?: AxiosError;
  setSaveError: (value?: AxiosError) => void;
}

export const SelectDependency: React.FC<SelectDependencyProps> = ({
  fieldId,
  toStringFn,

  value,
  setValue,
  options,

  isFetching,
  fetchError,

  isSaving,
  setIsSaving,
  setSaveError,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleSelectFetch
      isDisabled={isSaving}
      value={value}
      onChange={(selection) => {
        const selectionWithValue = selection as OptionWithValue<ApplicationDependency>;
        const elementExists = value.find((f) => {
          return isEqual(f, selectionWithValue);
        });

        setIsSaving(true);
        setSaveError(undefined);

        if (elementExists) {
          deleteApplicationDependency(elementExists.value.id!)
            .then(() => {
              let nextValue: OptionWithValue<ApplicationDependency>[];
              nextValue = value.filter(
                (f: OptionWithValue<ApplicationDependency>) => {
                  return !isEqual(f, elementExists);
                }
              );

              setValue(nextValue);

              setIsSaving(false);
              setSaveError(undefined);
            })
            .catch((error) => {
              setIsSaving(false);
              setSaveError(error);
            });
        } else {
          createApplicationDependency(selectionWithValue.value)
            .then(({ data }) => {
              let nextValue: OptionWithValue<ApplicationDependency>[];
              nextValue = [...value, dependencyToOption(data, toStringFn)];

              setValue(nextValue);

              setIsSaving(false);
              setSaveError(undefined);
            })
            .catch((error) => {
              setIsSaving(false);
              setSaveError(error);
            });
        }
      }}
      variant="typeaheadmulti"
      aria-label={fieldId}
      aria-describedby={fieldId}
      // t("terms.applications")
      placeholderText={t("composed.selectMany", {
        what: t("terms.applications").toLowerCase(),
      })}
      menuAppendTo={() => document.body}
      maxHeight={DEFAULT_SELECT_MAX_HEIGHT}
      options={options}
      isFetching={isFetching}
      fetchError={fetchError}
      noResultsFoundText={t("message.noResultsFoundTitle")}
    />
  );
};
