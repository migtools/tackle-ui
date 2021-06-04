import React, { useMemo } from "react";
import { AxiosPromise, AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";
import { useFormik, FormikProvider, FormikHelpers } from "formik";
import { object, string, mixed } from "yup";

import {
  ActionGroup,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  NumberInput,
  TextArea,
} from "@patternfly/react-core";

import { OptionWithValue, SingleSelectFormikField } from "shared/components";

import {
  DEFAULT_SELECT_MAX_HEIGHT,
  DEFAULT_PROPOSED_ACTIONS,
  DEFAULT_EFFORTS,
} from "Constants";
import {
  getValidatedFromError,
  getValidatedFromErrorTouched,
} from "utils/utils";
import { number } from "yup";
import { Application, Review } from "api/models";
import { createReview, updateReview } from "api/rest";

const actionOptions: SimpleOption[] = Array.from(
  DEFAULT_PROPOSED_ACTIONS.keys()
).map((key) => {
  return {
    key,
    name: DEFAULT_PROPOSED_ACTIONS.get(key)!,
  };
});

const effortOptions: SimpleOption[] = Array.from(DEFAULT_EFFORTS.keys()).map(
  (key) => {
    return {
      key,
      name: DEFAULT_EFFORTS.get(key)?.label || key,
    };
  }
);

interface SimpleOption {
  key: string;
  name: string;
}

const toOptionWithValue = (
  value: SimpleOption
): OptionWithValue<SimpleOption> => ({
  value,
  toString: () => value.name,
});

export interface FormValues {
  action?: OptionWithValue<SimpleOption>;
  effort?: OptionWithValue<SimpleOption>;
  criticality?: number;
  priority?: number;
  comments: string;
}

export interface IReviewFormProps {
  application: Application;
  review?: Review;
  onSaved: (response: AxiosResponse<Review>) => void;
  onCancel: () => void;
}

export const ReviewForm: React.FC<IReviewFormProps> = ({
  application,
  review,
  onSaved,
  onCancel,
}) => {
  const { t } = useTranslation();

  // Formik

  const validationSchema = object().shape({
    action: mixed().required(t("validation.required")),
    effort: mixed().required(t("validation.required")),
    criticality: number()
      .required(t("validation.required"))
      .min(1, t("validation.min", { value: 1 }))
      .max(10, t("validation.max", { value: 10 })),
    priority: number()
      .required(t("validation.required"))
      .min(1, t("validation.min", { value: 1 }))
      .max(10, t("validation.max", { value: 10 })),
    comments: string()
      .trim()
      .max(1024, t("validation.maxLength", { length: 1024 })),
  });

  const onSubmit = (
    formValues: FormValues,
    formikHelpers: FormikHelpers<FormValues>
  ) => {
    const payload: Review = {
      ...review,
      proposedAction: formValues.action ? formValues.action.value.key : "",
      effortEstimate: formValues.effort ? formValues.effort.value.key : "",
      businessCriticality: formValues.criticality || 0,
      workPriority: formValues.priority || 0,
      comments: formValues.comments.trim(),
      application: application,
    };

    let promise: AxiosPromise<Review>;
    if (review) {
      promise = updateReview({
        ...review,
        ...payload,
      });
    } else {
      promise = createReview(payload);
    }

    promise
      .then((response) => {
        formikHelpers.setSubmitting(false);
        onSaved(response);
      })
      .catch((error) => {
        formikHelpers.setSubmitting(false);
        // onError(error);
      });
  };

  const actionInitialValue:
    | OptionWithValue<SimpleOption>
    | undefined = useMemo(() => {
    let result: OptionWithValue<SimpleOption> | undefined;
    if (review) {
      const exists = actionOptions.find((f) => f.key === review.proposedAction);
      result = toOptionWithValue(
        exists || { key: review.proposedAction, name: t("terms.unknown") }
      );
    }
    return result;
  }, [review, t]);

  const effortInitialValue:
    | OptionWithValue<SimpleOption>
    | undefined = useMemo(() => {
    let result: OptionWithValue<SimpleOption> | undefined;
    if (review) {
      const exists = effortOptions.find((f) => f.key === review.effortEstimate);
      result = toOptionWithValue(
        exists || { key: review.effortEstimate, name: t("terms.unknown") }
      );
    }
    return result;
  }, [review, t]);

  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    initialValues: {
      action: actionInitialValue,
      effort: effortInitialValue,
      criticality: review?.businessCriticality || 1,
      priority: review?.workPriority || 1,
      comments: review?.comments || "",
    },
    validationSchema: validationSchema,
    onSubmit: onSubmit,
  });

  return (
    <FormikProvider value={formik}>
      <Form onSubmit={formik.handleSubmit}>
        <FormGroup
          label={t("terms.proposedAction")}
          fieldId="action"
          isRequired={true}
          validated={getValidatedFromError(formik.errors.action)}
          helperTextInvalid={formik.errors.action}
        >
          <SingleSelectFormikField
            fieldConfig={{ name: "action" }}
            selectConfig={{
              variant: "typeahead",
              "aria-label": "action",
              "aria-describedby": "action",
              placeholderText: t("terms.select"),
              maxHeight: DEFAULT_SELECT_MAX_HEIGHT,
              options: actionOptions.map(toOptionWithValue),
            }}
          />
        </FormGroup>
        <FormGroup
          label={t("terms.effortEstimate")}
          fieldId="effort"
          isRequired={true}
          validated={getValidatedFromError(formik.errors.effort)}
          helperTextInvalid={formik.errors.effort}
        >
          <SingleSelectFormikField
            fieldConfig={{ name: "effort" }}
            selectConfig={{
              variant: "typeahead",
              "aria-label": "effort",
              "aria-describedby": "effort",
              placeholderText: t("terms.select"),
              maxHeight: DEFAULT_SELECT_MAX_HEIGHT,
              options: effortOptions.map(toOptionWithValue),
            }}
          />
        </FormGroup>
        <FormGroup
          label={t("composed.businessCriticality")}
          fieldId="criticality"
          isRequired={true}
          validated={getValidatedFromError(formik.errors.criticality)}
          helperTextInvalid={formik.errors.criticality}
        >
          <NumberInput
            inputName="criticality"
            inputAriaLabel="criticality"
            minusBtnAriaLabel="minus"
            plusBtnAriaLabel="plus"
            value={formik.values.criticality}
            min={1}
            max={10}
            onMinus={() => {
              formik.setFieldValue(
                "criticality",
                (formik.values.criticality || 0) - 1
              );
            }}
            onChange={formik.handleChange}
            onPlus={() => {
              formik.setFieldValue(
                "criticality",
                (formik.values.criticality || 0) + 1
              );
            }}
          />
        </FormGroup>
        <FormGroup
          label={t("composed.workPriority")}
          fieldId="priority"
          isRequired={true}
          validated={getValidatedFromError(formik.errors.priority)}
          helperTextInvalid={formik.errors.priority}
        >
          <NumberInput
            inputName="priority"
            inputAriaLabel="priority"
            minusBtnAriaLabel="minus"
            plusBtnAriaLabel="plus"
            value={formik.values.priority}
            min={1}
            max={10}
            onMinus={() => {
              formik.setFieldValue(
                "priority",
                (formik.values.priority || 0) - 1
              );
            }}
            onChange={formik.handleChange}
            onPlus={() => {
              formik.setFieldValue(
                "priority",
                (formik.values.priority || 0) + 1
              );
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
            onChange={(_, event) => formik.handleChange(event)}
            onBlur={formik.handleBlur}
            value={formik.values.comments}
            validated={getValidatedFromErrorTouched(
              formik.errors.comments,
              formik.touched.comments
            )}
            resizeOrientation="vertical"
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
            {t("actions.submitReview")}
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
