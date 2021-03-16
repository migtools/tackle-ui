import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AxiosError, AxiosPromise, AxiosResponse } from "axios";
import { useFormik, FormikProvider, FormikHelpers } from "formik";
import { object, string } from "yup";

import {
  ActionGroup,
  Alert,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  SelectOptionObject,
  TextArea,
  TextInput,
} from "@patternfly/react-core";

import { SelectEntityFormikField } from "shared/components";
import { useFetchStakeholders, useFetchStakeholderGroups } from "shared/hooks";

import { createApplication, updateApplication } from "api/rest";
import {
  Application,
  Assessment,
  BusinessService,
  Stakeholder,
  StakeholderGroup,
} from "api/models";
import {
  getAxiosErrorMessage,
  getValidatedFromError,
  getValidatedFromErrorTouched,
} from "utils/utils";

import { DEFAULT_SELECT_MAX_HEIGHT } from "Constants";

interface SelectOptionStakeholder extends SelectOptionObject {
  entity: Stakeholder;
}

const selectOptionMapperStakeholder = (
  entity: Stakeholder
): SelectOptionStakeholder => ({
  entity: { ...entity },
  toString: () => {
    return entity.displayName;
  },
});

interface SelectOptionGroup extends SelectOptionObject {
  entity: StakeholderGroup;
}

const selectOptionMapperGroup = (
  entity: StakeholderGroup
): SelectOptionGroup => ({
  entity: { ...entity },
  toString: () => {
    return entity.name;
  },
});

export interface FormValues {
  stakeholders: SelectOptionStakeholder[];
  stakeholderGroups: SelectOptionGroup[];
}

export interface StakeholdersFormProps {
  assessment: Assessment;
}

export const StakeholdersForm: React.FC<StakeholdersFormProps> = ({
  assessment,
}) => {
  const { t } = useTranslation();

  const [error, setError] = useState<AxiosError>();

  const {
    stakeholders,
    isFetching: isFetchingStakeholders,
    fetchError: fetchErrorStakeholders,
    fetchAllStakeholders,
  } = useFetchStakeholders();

  const {
    stakeholderGroups: groups,
    isFetching: isFetchingGroups,
    fetchError: fetchErrorGroups,
    fetchAllStakeholderGroups: fetchGroups,
  } = useFetchStakeholderGroups();

  useEffect(() => {
    fetchAllStakeholders();
    fetchGroups();
  }, [fetchAllStakeholders, fetchGroups]);

  const stakeholdersInitialValue = useMemo(() => {
    let result: SelectOptionStakeholder[] = [];

    if (
      assessment &&
      assessment.stakeholders &&
      stakeholders &&
      stakeholders.data
    ) {
      result = assessment.stakeholders.map((stakeholderId) => {
        const searched = stakeholders.data.find(
          (stakeholder) => stakeholder.id === stakeholderId
        );

        return searched
          ? selectOptionMapperStakeholder(searched)
          : selectOptionMapperStakeholder({
              id: stakeholderId,
              displayName: t("terms.unknown"),
              email: t("terms.unknown"),
            });
      });
    }

    return result;
  }, [assessment, stakeholders, t]);

  const groupsInitialValue = useMemo(() => {
    let result: SelectOptionGroup[] = [];

    if (assessment && assessment.stakeholderGroups && groups && groups.data) {
      result = assessment.stakeholderGroups.map((groupId) => {
        const searched = groups.data.find((group) => group.id === groupId);

        return searched
          ? selectOptionMapperGroup(searched)
          : selectOptionMapperGroup({
              id: groupId,
              name: t("terms.unknown"),
              description: t("terms.unknown"),
            });
      });
    }

    return result;
  }, [assessment, stakeholders, t]);

  const initialValues: FormValues = {
    stakeholders: stakeholdersInitialValue,
    stakeholderGroups: groupsInitialValue,
  };

  const validationSchema = object().shape({});

  const onSubmit = (
    formValues: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    console.log(formValues);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit}>
        {error && (
          <Alert
            variant="danger"
            isInline
            title={getAxiosErrorMessage(error)}
          />
        )}
        <FormGroup
          label={t("terms.stakeholders")}
          fieldId="stakeholders"
          isRequired={false}
          validated={getValidatedFromError(formik.errors.stakeholders)}
          helperTextInvalid={formik.errors.stakeholders}
        >
          <SelectEntityFormikField
            fieldConfig={{
              name: "stakeholders",
            }}
            selectConfig={{
              isMulti: false,
              options: (stakeholders?.data || []).map((f) =>
                selectOptionMapperStakeholder(f)
              ),
              isEqual: (a: SelectOptionObject, b: SelectOptionObject) => {
                return (
                  (a as SelectOptionStakeholder).entity.id ===
                  (b as SelectOptionStakeholder).entity.id
                );
              },

              isFetching: isFetchingStakeholders,
              fetchError: fetchErrorStakeholders,

              maxHeight: DEFAULT_SELECT_MAX_HEIGHT,
              placeholderText: "Select stakeholder(s)",
              "aria-label": "stakeholders",
              "aria-describedby": "stakeholders",
            }}
          />
        </FormGroup>
        <FormGroup
          label={t("terms.stakeholderGroups")}
          fieldId="stakeholderGroups"
          isRequired={false}
          validated={getValidatedFromError(formik.errors.stakeholderGroups)}
          helperTextInvalid={formik.errors.stakeholderGroups}
        >
          <SelectEntityFormikField
            fieldConfig={{
              name: "stakeholderGroups",
            }}
            selectConfig={{
              isMulti: false,
              options: (groups?.data || []).map((f) =>
                selectOptionMapperGroup(f)
              ),
              isEqual: (a: SelectOptionObject, b: SelectOptionObject) => {
                return (
                  (a as SelectOptionGroup).entity.id ===
                  (b as SelectOptionGroup).entity.id
                );
              },

              isFetching: isFetchingGroups,
              fetchError: fetchErrorGroups,

              maxHeight: DEFAULT_SELECT_MAX_HEIGHT,
              placeholderText: "Select stakeholder group(s)",
              "aria-label": "stakeholderGroups",
              "aria-describedby": "stakeholderGroups",
            }}
          />
        </FormGroup>

        <ActionGroup>
          <Button
            type="submit"
            aria-label="submit"
            variant={ButtonVariant.primary}
            isDisabled={
              !formik.isValid ||
              !formik.dirty ||
              formik.isSubmitting ||
              formik.isValidating
            }
          >
            {!application ? t("actions.create") : t("actions.save")}
          </Button>
          <Button
            type="button"
            aria-label="cancel"
            variant={ButtonVariant.link}
            isDisabled={formik.isSubmitting || formik.isValidating}
            onClick={onCancel}
          >
            {t("actions.cancel")}
          </Button>
        </ActionGroup>
      </Form>
    </FormikProvider>
  );
};
