import React, { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Spinner,
  Text,
  TextContent,
} from "@patternfly/react-core";

import { OptionWithValue } from "shared/components";
import { useFetch } from "shared/hooks";

import {
  Application,
  ApplicationDependency,
  ApplicationDependencyPage,
  ApplicationPage,
  PageRepresentation,
} from "api/models";

import {
  applicationDependencyPageMapper,
  applicationPageMapper,
  getAllApplicationDependencies,
  getAllApplications,
} from "api/apiUtils";
import { getAxiosErrorMessage } from "utils/utils";

import { FormContext } from "./form-context";
import { SelectDependency } from "./select-dependency";

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
  const {
    isNorthBeingSaved,
    isSouthBeingSaved,
    northSaveError,
    southSaveError,
    setIsNorthBeingSaved,
    setIsSouthBeingSaved,
    setNorthSaveError,
    setSouthSaveError,
  } = useContext(FormContext);

  const { t } = useTranslation();

  const [northboundDependencies, setNorthboundDependencies] = useState<
    OptionWithValue<ApplicationDependency>[]
  >([]);
  const [southboundDependencies, setSouthboundDependencies] = useState<
    OptionWithValue<ApplicationDependency>[]
  >([]);

  // Dependencies

  const getAllNorthApplicationDependencies = useCallback(() => {
    return getAllApplicationDependencies({
      to: [`${application.id}`],
    });
  }, [application]);

  const getAllSouthApplicationDependencies = useCallback(() => {
    return getAllApplicationDependencies({
      from: [`${application.id}`],
    });
  }, [application]);

  const {
    data: northDependencies,
    isFetching: isFetchingNorthDependencies,
    fetchError: fetchErrorNorthDependencies,
    requestFetch: fetchAllNorthDependencies,
  } = useFetch<
    ApplicationDependencyPage,
    PageRepresentation<ApplicationDependency>
  >({
    defaultIsFetching: true,
    onFetch: getAllNorthApplicationDependencies,
    mapper: applicationDependencyPageMapper,
  });

  const {
    data: southDependencies,
    isFetching: isFetchingSouthDependencies,
    fetchError: fetchErrorSouthDependencies,
    requestFetch: fetchAllSouthDependencies,
  } = useFetch<
    ApplicationDependencyPage,
    PageRepresentation<ApplicationDependency>
  >({
    defaultIsFetching: true,
    onFetch: getAllSouthApplicationDependencies,
    mapper: applicationDependencyPageMapper,
  });

  useEffect(() => {
    fetchAllNorthDependencies();
  }, [fetchAllNorthDependencies]);

  useEffect(() => {
    fetchAllSouthDependencies();
  }, [fetchAllSouthDependencies]);

  // Applications

  const {
    data: applications,
    isFetching: isFetchingApplications,
    fetchError: fetchErrorApplications,
    requestFetch: fetchAllApplications,
  } = useFetch<ApplicationPage, PageRepresentation<Application>>({
    defaultIsFetching: true,
    onFetch: getAllApplications,
    mapper: applicationPageMapper,
  });

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

  const savingMsg = (
    <div className="pf-u-font-size-sm">
      <Spinner isSVG size="sm" /> {`${t("message.savingSelection")}...`}
    </div>
  );

  return (
    <Form>
      <TextContent>
        <Text component="p">
          Add northbound and southbound dependencies for the selected
          application here. Note that any selections made will be saved
          automatically. To undo any changes, you must manually delete the
          applications from the dropdowns.
        </Text>
      </TextContent>

      <FormGroup
        // t("terms.northboundDependencies")
        label={t("composed.add", {
          what: t("terms.northboundDependencies").toLowerCase(),
        })}
        fieldId="northbound-dependencies"
        isRequired={false}
        validated={northSaveError ? "error" : "default"}
        helperTextInvalid={
          northSaveError ? getAxiosErrorMessage(northSaveError) : ""
        }
        helperText={isNorthBeingSaved ? savingMsg : ""}
      >
        <SelectDependency
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
          isSaving={isNorthBeingSaved}
          setIsSaving={setIsNorthBeingSaved}
          saveError={northSaveError}
          setSaveError={setNorthSaveError}
        />
      </FormGroup>
      <FormGroup
        // t("terms.southboundDependencies")
        label={t("composed.add", {
          what: t("terms.southboundDependencies").toLowerCase(),
        })}
        fieldId="southbound-dependencies"
        isRequired={false}
        validated={southSaveError ? "error" : "default"}
        helperTextInvalid={
          southSaveError ? getAxiosErrorMessage(southSaveError) : ""
        }
        helperText={isSouthBeingSaved ? savingMsg : ""}
      >
        <SelectDependency
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
          isSaving={isSouthBeingSaved}
          setIsSaving={setIsSouthBeingSaved}
          saveError={southSaveError}
          setSaveError={setSouthSaveError}
        />
      </FormGroup>

      <ActionGroup>
        <Button
          type="button"
          aria-label="close"
          variant={ButtonVariant.primary}
          onClick={onCancel}
          isDisabled={isNorthBeingSaved || isSouthBeingSaved}
        >
          {t("actions.close")}
        </Button>
      </ActionGroup>
    </Form>
  );
};
