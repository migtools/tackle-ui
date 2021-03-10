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

import { useFetchBusinessServices } from "shared/hooks";

import { createApplication, updateApplication } from "api/rest";
import { Application, BusinessService } from "api/models";
import {
  getAxiosErrorMessage,
  getValidatedFromError,
  getValidatedFromErrorTouched,
} from "utils/utils";
import { SelectEntityFormikField } from "shared/components";
import { DEFAULT_SELECT_MAX_HEIGHT } from "Constants";

interface SelectOptionEntity extends SelectOptionObject {
  entity: BusinessService;
}

const selectOptionMapper = (entity: BusinessService): SelectOptionEntity => ({
  entity: { ...entity },
  toString: () => {
    return entity.name;
  },
});

export interface FormValues {
  name: string;
  description?: string;
  comments?: string;
  businessService?: SelectOptionEntity;
}

export interface ApplicationFormProps {
  application?: Application;
  onSaved: (response: AxiosResponse<Application>) => void;
  onCancel: () => void;
}

export const ApplicationForm: React.FC<ApplicationFormProps> = ({
  application,
  onSaved,
  onCancel,
}) => {
  const { t } = useTranslation();

  const [error, setError] = useState<AxiosError>();

  const {
    businessServices,
    isFetching: isFetchingBusinessServices,
    fetchError: fetchErrorBusinessServices,
    fetchAllBusinessServices,
  } = useFetchBusinessServices();

  useEffect(() => {
    fetchAllBusinessServices();
  }, [fetchAllBusinessServices]);

  const businessServiceInitialValue = useMemo(() => {
    let result: SelectOptionEntity | undefined = undefined;
    if (
      application &&
      application.businessService &&
      businessServices &&
      businessServices.data
    ) {
      const businessServiceId = Number(application.businessService);
      const businessService = businessServices.data.find(
        (f) => f.id === businessServiceId
      );

      result = selectOptionMapper({
        id: businessServiceId,
        name: businessService ? businessService.name : t("terms.unknown"),
      });
    }

    return result;
  }, [application, businessServices, t]);

  const initialValues: FormValues = {
    name: application?.name || "",
    description: application?.description || "",
    comments: application?.comments || "",
    businessService: businessServiceInitialValue,
  };

  const validationSchema = object().shape({
    name: string()
      .trim()
      .required(t("validation.required"))
      .min(3, t("validation.minLength", { length: 3 }))
      .max(120, t("validation.maxLength", { length: 120 })),
    description: string()
      .trim()
      .max(250, t("validation.maxLength", { length: 250 })),
    comments: string()
      .trim()
      .max(250, t("validation.maxLength", { length: 250 })),
  });

  const onSubmit = (
    formValues: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    const payload: Application = {
      name: formValues.name,
      description: formValues.description,
      comments: formValues.comments,
      businessService: formValues.businessService
        ? `${formValues.businessService.entity.id}`
        : undefined,
    };

    let promise: AxiosPromise<Application>;
    if (application) {
      promise = updateApplication({
        ...application,
        ...payload,
      });
    } else {
      promise = createApplication(payload);
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
          label={t("terms.name")}
          fieldId="name"
          isRequired={true}
          validated={getValidatedFromError(formik.errors.name)}
          helperTextInvalid={formik.errors.name}
        >
          <TextInput
            type="text"
            name="name"
            aria-label="name"
            aria-describedby="name"
            isRequired={true}
            onChange={onChangeField}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            validated={getValidatedFromErrorTouched(
              formik.errors.name,
              formik.touched.name
            )}
          />
        </FormGroup>
        <FormGroup
          label={t("terms.description")}
          fieldId="description"
          isRequired={false}
          validated={getValidatedFromError(formik.errors.description)}
          helperTextInvalid={formik.errors.description}
        >
          <TextInput
            type="text"
            name="description"
            aria-label="description"
            aria-describedby="description"
            isRequired={true}
            onChange={onChangeField}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            validated={getValidatedFromErrorTouched(
              formik.errors.description,
              formik.touched.description
            )}
          />
        </FormGroup>
        <FormGroup
          label={t("terms.businessService")}
          fieldId="businessService"
          isRequired={false}
          validated={getValidatedFromError(formik.errors.businessService)}
          helperTextInvalid={formik.errors.businessService}
        >
          <SelectEntityFormikField
            fieldConfig={{
              name: "businessService",
            }}
            selectConfig={{
              isMulti: false,
              options: (businessServices?.data || []).map((f) =>
                selectOptionMapper(f)
              ),
              isEqual: (a: SelectOptionObject, b: SelectOptionObject) => {
                return (
                  (a as SelectOptionEntity).entity.id ===
                  (b as SelectOptionEntity).entity.id
                );
              },

              isFetching: isFetchingBusinessServices,
              fetchError: fetchErrorBusinessServices,

              menuAppendTo: () => document.body,
              maxHeight: DEFAULT_SELECT_MAX_HEIGHT,
              placeholderText: t("composed.selectOne", {
                what: t("terms.businessService"),
              }),
              "aria-label": "business-service",
              "aria-describedby": "business-service",
            }}
          />
        </FormGroup>
        <FormGroup
          label={t("terms.comments")}
          fieldId="comments"
          isRequired={false}
          validated={getValidatedFromError(formik.errors.comments)}
          helperTextInvalid={formik.errors.comments}
        >
          <TextArea
            type="text"
            name="comments"
            aria-label="comments"
            aria-describedby="comments"
            isRequired={false}
            onChange={onChangeField}
            onBlur={formik.handleBlur}
            value={formik.values.comments}
            validated={getValidatedFromErrorTouched(
              formik.errors.comments,
              formik.touched.comments
            )}
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
