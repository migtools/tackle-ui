import React, { useEffect, useState } from "react";
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
  TextInput,
} from "@patternfly/react-core";

import { useFetchStakeholderGroups } from "shared/hooks";

import { createStakeholder, updateStakeholder } from "api/rest";
import { Stakeholder, StakeholderGroup } from "api/models";
import {
  getAxiosErrorMessage,
  getValidatedFromError,
  getValidatedFromErrorTouched,
} from "utils/utils";

import { SelectGroupFormField } from "../select-group-form-field";

export interface FormValues {
  email: string;
  displayName: string;
  groups: StakeholderGroup[];
}

export interface StakeholderFormProps {
  stakeholder?: Stakeholder;
  onSaved: (response: AxiosResponse<Stakeholder>) => void;
  onCancel: () => void;
}

export const StakeholderForm: React.FC<StakeholderFormProps> = ({
  stakeholder,
  onSaved,
  onCancel,
}) => {
  const { t } = useTranslation();

  const [error, setError] = useState<AxiosError>();

  const {
    stakeholderGroups,
    isFetching,
    fetchError,
    fetchAllStakeholderGroups,
  } = useFetchStakeholderGroups();

  useEffect(() => {
    fetchAllStakeholderGroups();
  }, [fetchAllStakeholderGroups]);

  const initialValues: FormValues = {
    email: stakeholder?.email || "",
    displayName: stakeholder?.displayName || "",
    groups: stakeholder?.groups || [],
  };

  const validationSchema = object().shape({
    email: string()
      .trim()
      .required(t("validation.required"))
      .min(3, t("validation.minLength", { length: 3 }))
      .max(120, t("validation.maxLength", { length: 120 }))
      .email(t("validation.email")),
    displayName: string()
      .trim()
      .required(t("validation.required"))
      .min(3, t("validation.minLength", { length: 3 }))
      .max(250, t("validation.maxLength", { length: 250 })),
  });

  const onSubmit = (
    formValues: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    const payload: Stakeholder = {
      email: formValues.email,
      displayName: formValues.displayName,
      groups: [...formValues.groups],
    };

    let promise: AxiosPromise<Stakeholder>;
    if (stakeholder) {
      promise = updateStakeholder({
        ...stakeholder,
        ...payload,
      });
    } else {
      promise = createStakeholder(payload);
    }

    promise
      .then((response) => {
        formikHelpers.setSubmitting(false);
        onSaved(response);
      })
      .catch((error) => {
        formikHelpers.setSubmitting(false);
        setError(error);
      });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  const onChangeField = (value: string, event: React.FormEvent<any>) => {
    formik.handleChange(event);
  };

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
          label={t("terms.email")}
          fieldId="email"
          isRequired={true}
          validated={getValidatedFromError(formik.errors.email)}
          helperTextInvalid={formik.errors.email}
        >
          <TextInput
            type="text"
            name="email"
            aria-label="email"
            aria-describedby="email"
            isRequired={true}
            onChange={onChangeField}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            validated={getValidatedFromErrorTouched(
              formik.errors.email,
              formik.touched.email
            )}
          />
        </FormGroup>
        <FormGroup
          label={t("terms.displayName")}
          fieldId="displayName"
          isRequired={true}
          validated={getValidatedFromError(formik.errors.displayName)}
          helperTextInvalid={formik.errors.displayName}
        >
          <TextInput
            type="text"
            name="displayName"
            aria-label="displayName"
            aria-describedby="displayName"
            isRequired={true}
            onChange={onChangeField}
            onBlur={formik.handleBlur}
            value={formik.values.displayName}
            validated={getValidatedFromErrorTouched(
              formik.errors.displayName,
              formik.touched.displayName
            )}
          />
        </FormGroup>
        <FormGroup
          label={t("terms.group(s)")}
          fieldId="groups"
          isRequired={false}
          validated={getValidatedFromError(formik.errors.groups)}
          helperTextInvalid={formik.errors.groups}
        >
          <SelectGroupFormField
            name="groups"
            groups={stakeholderGroups?.data || []}
            isFetching={isFetching}
            fetchError={fetchError}
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
            {!stakeholder ? t("actions.create") : t("actions.save")}
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
