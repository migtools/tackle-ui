import React, { useState } from "react";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useFormik, FormikProvider } from "formik";

import {
  ActionGroup,
  Alert,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";

import { getAxiosErrorMessage } from "utils/utils";

export const ReviewForm: React.FC = () => {
  const { t } = useTranslation();

  const [error] = useState<AxiosError>();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {},
    // validationSchema: validationSchema,
    onSubmit: () => {},
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
          label={t("terms.email")}
          fieldId="email"
          isRequired={true}
          // validated={getValidatedFromError(formik.errors.email)}
          // helperTextInvalid={formik.errors.email}
        >
          <TextInput
            type="text"
            name="email"
            aria-label="email"
            aria-describedby="email"
            isRequired={true}
            // onChange={onChangeField}
            // onBlur={formik.handleBlur}
            // value={formik.values.email}
            // validated={getValidatedFromErrorTouched(
            //   formik.errors.email,
            //   formik.touched.email
            // )}
          />
        </FormGroup>
        <FormGroup
          label={t("terms.displayName")}
          fieldId="displayName"
          isRequired={true}
          // validated={getValidatedFromError(formik.errors.displayName)}
          // helperTextInvalid={formik.errors.displayName}
        >
          <TextInput
            type="text"
            name="displayName"
            aria-label="displayName"
            aria-describedby="displayName"
            isRequired={true}
            // onChange={onChangeField}
            // onBlur={formik.handleBlur}
            // value={formik.values.displayName}
            // validated={getValidatedFromErrorTouched(
            //   formik.errors.displayName,
            //   formik.touched.displayName
            // )}
          />
        </FormGroup>
        <FormGroup
          label={t("terms.jobFunction")}
          fieldId="jobFunction"
          isRequired={false}
          // validated={getValidatedFromError(formik.errors.jobFunction)}
          // helperTextInvalid={formik.errors.jobFunction}
        >
          {/* <SingleSelectFetchFormikField
            fieldConfig={{ name: "jobFunction" }}
            selectConfig={{
              variant: "typeahead",
              "aria-label": "job-function",
              "aria-describedby": "job-function",
              placeholderText: t("composed.selectOne", {
                what: t("terms.jobFunction").toLowerCase(),
              }),
              menuAppendTo: () => document.body,
              maxHeight: DEFAULT_SELECT_MAX_HEIGHT,
              options: (jobFunctions?.data || []).map(jobFunctionToOption),
              isFetching: isFetchingJobFunctions,
              fetchError: fetchErrorJobFunctions,
            }}
          /> */}
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
            {t("actions.create")}
          </Button>
          <Button
            type="button"
            aria-label="cancel"
            variant={ButtonVariant.link}
            isDisabled={formik.isSubmitting || formik.isValidating}
            onClick={() => {}}
          >
            {t("actions.cancel")}
          </Button>
        </ActionGroup>
      </Form>
    </FormikProvider>
  );
};
