import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError } from "axios";

import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
} from "@patternfly/react-core";

import { OptionWithValue, SimpleSelectFetch } from "shared/components";
import {
  useFetchApplicationDependencies,
  useFetchApplications,
} from "shared/hooks";

import { DEFAULT_SELECT_MAX_HEIGHT } from "Constants";
import {
  createApplicationDependency,
  deleteApplicationDependency,
} from "api/rest";
import { Application, ApplicationDependency } from "api/models";
import { getAxiosErrorMessage } from "utils/utils";

const isEqual = (
  a: OptionWithValue<ApplicationDependency>,
  b: OptionWithValue<ApplicationDependency>
) => {
  return (
    (a.value.id && b.value.id && a.value.id === b.value.id) ||
    (a.value.from.id === b.value.from.id && a.value.to.id === b.value.to.id)
  );
};

const northToStringFn = (value: ApplicationDependency) => value.from.name;
const southToStringFn = (value: ApplicationDependency) => value.to.name;

const dependencyToOption = (
  value: ApplicationDependency,
  toStringFn: (value: ApplicationDependency) => string
): OptionWithValue<ApplicationDependency> => ({
  value,
  toString: () => toStringFn(value),
});

export interface ApplicationDependenciesFormProps {
  application: Application;
  onCancel: () => void;
}

export const ApplicationDependenciesForm: React.FC<ApplicationDependenciesFormProps> = ({
  application,
  onCancel,
}) => {
  const { t } = useTranslation();

  const [northboundDependencies, setNorthboundDependencies] = useState<
    OptionWithValue<ApplicationDependency>[]
  >([]);
  const [southboundDependencies, setSouthboundDependencies] = useState<
    OptionWithValue<ApplicationDependency>[]
  >([]);

  // Dependencies

  const {
    applicationDependencies: northDependencies,
    isFetching: isFetchingNorthDependencies,
    fetchError: fetchErrorNorthDependencies,
    fetchAllApplicationDependencies: fetchAllNorthDependencies,
  } = useFetchApplicationDependencies();

  const {
    applicationDependencies: southDependencies,
    isFetching: isFetchingSouthDependencies,
    fetchError: fetchErrorSouthDependencies,
    fetchAllApplicationDependencies: fetchAllSouthDependencies,
  } = useFetchApplicationDependencies();

  useEffect(() => {
    fetchAllNorthDependencies({
      to: [`${application.id}`],
    });
  }, [application, fetchAllNorthDependencies]);

  useEffect(() => {
    fetchAllSouthDependencies({
      from: [`${application.id}`],
    });
  }, [application, fetchAllSouthDependencies]);

  // Applications

  const {
    applications,
    isFetching: isFetchingApplications,
    fetchError: fetchErrorApplications,
    fetchAllApplications,
  } = useFetchApplications();

  useEffect(() => {
    fetchAllApplications();
  }, [fetchAllApplications]);

  // Initial value

  useEffect(() => {
    if (northDependencies) {
      const north = northDependencies.data
        .filter((f) => f.to.id === application.id)
        .map((f) => dependencyToOption(f, northToStringFn));
      setNorthboundDependencies(north);
    }
  }, [application, northDependencies]);

  useEffect(() => {
    if (southDependencies) {
      const south = southDependencies.data
        .filter((f) => f.from.id === application.id)
        .map((f) => dependencyToOption(f, southToStringFn));
      setSouthboundDependencies(south);
    }
  }, [application, southDependencies]);

  return (
    <Form>
      <DependencyFormGroup
        label={t("terms.northboundDependencies")}
        fieldId="northbound-dependencies"
        toStringFn={northToStringFn}
        value={northboundDependencies}
        setValue={setNorthboundDependencies}
        options={(applications?.data || [])
          .filter((f) => f.id !== application.id)
          .map((f) =>
            dependencyToOption({ from: f, to: application }, northToStringFn)
          )}
        isFetching={isFetchingApplications || isFetchingNorthDependencies}
        fetchError={fetchErrorApplications || fetchErrorNorthDependencies}
      />
      <DependencyFormGroup
        label={t("terms.southboundDependencies")}
        fieldId="southbound-dependencies"
        toStringFn={southToStringFn}
        value={southboundDependencies}
        setValue={setSouthboundDependencies}
        options={(applications?.data || [])
          .filter((f) => f.id !== application.id)
          .map((f) =>
            dependencyToOption({ from: application, to: f }, southToStringFn)
          )}
        isFetching={isFetchingApplications || isFetchingSouthDependencies}
        fetchError={fetchErrorApplications || fetchErrorSouthDependencies}
      />

      <ActionGroup>
        <Button
          type="button"
          aria-label="close"
          variant={ButtonVariant.primary}
          onClick={onCancel}
        >
          {t("actions.close")}
        </Button>
      </ActionGroup>
    </Form>
  );
};

export interface DependencyFormGroupProps {
  label: string;
  fieldId: string;
  toStringFn: (value: ApplicationDependency) => string;

  value: OptionWithValue<ApplicationDependency>[];
  options: OptionWithValue<ApplicationDependency>[];
  setValue: (value: OptionWithValue<ApplicationDependency>[]) => void;

  isFetching: boolean;
  fetchError?: AxiosError;
}

export const DependencyFormGroup: React.FC<DependencyFormGroupProps> = ({
  label,
  fieldId,
  toStringFn,

  value,
  options,
  setValue,

  isFetching,
  fetchError,
}) => {
  const { t } = useTranslation();

  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState<AxiosError>();

  return (
    <FormGroup
      label={label}
      fieldId={fieldId}
      isRequired={false}
      validated={error ? "error" : "default"}
      helperTextInvalid={error ? getAxiosErrorMessage(error) : ""}
    >
      <SimpleSelectFetch
        isDisabled={isDisabled}
        value={value}
        onChange={(selection) => {
          const selectionWithValue = selection as OptionWithValue<ApplicationDependency>;
          const elementExists = value.find((f) => {
            return isEqual(f, selectionWithValue);
          });

          setIsDisabled(true);

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

                setIsDisabled(false);
                setError(undefined);
              })
              .catch((error) => {
                setIsDisabled(false);
                setError(error);
              });
          } else {
            createApplicationDependency(selectionWithValue.value)
              .then(({ data }) => {
                let nextValue: OptionWithValue<ApplicationDependency>[];
                nextValue = [...value, dependencyToOption(data, toStringFn)];

                setValue(nextValue);

                setIsDisabled(false);
                setError(undefined);
              })
              .catch((error) => {
                setIsDisabled(false);
                setError(error);
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
      />
    </FormGroup>
  );
};
