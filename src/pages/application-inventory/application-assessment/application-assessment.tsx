import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormikHelpers, FormikProvider, useFormik } from "formik";
import { AxiosError } from "axios";

import {
  Alert,
  Bullseye,
  PageSection,
  PageSectionTypes,
  Text,
  TextContent,
  Wizard,
  WizardStep,
} from "@patternfly/react-core";
import { BanIcon } from "@patternfly/react-icons";

import {
  ConditionalRender,
  SimpleEmptyState,
  AppPlaceholder,
} from "shared/components";

import { AssessmentRoute, Paths } from "Paths";
import {
  Assessment,
  AssessmentStatus,
  Question,
  QuestionnaireCategory,
} from "api/models";
import { getAssessmentById, patchAssessment } from "api/rest";

import { ApplicationAssessmentHeader } from "./application-assessment-header";
import { CustomWizardFooter } from "./components/custom-wizard-footer";

import { StakeholdersForm } from "./components/stakeholders-form";
import { QuestionnaireForm } from "./components/questionnaire-form";

import { getCommentFieldName, getQuestionFieldName } from "./formik-utils";
import { getAxiosErrorMessage } from "utils/utils";

const SAVE_ACTION_KEY = "saveAction";
enum SAVE_ACTION_VALUE {
  SAVE,
  SAVE_AS_DRAFT,
}

export interface IFormValues {
  stakeholders: number[];
  stakeholderGroups: number[];
  comments: {
    [key: string]: string; // <categoryId, commentValue>
  };
  questions: {
    [key: string]: number | undefined; // <questionId, optionId>
  };
  [SAVE_ACTION_KEY]: SAVE_ACTION_VALUE;
}

export const ApplicationAssessment: React.FC = () => {
  const { t } = useTranslation();

  const history = useHistory();
  const { assessmentId } = useParams<AssessmentRoute>();

  const [currentStep, setCurrentStep] = useState(0);

  const [saveError, setSaveError] = useState<AxiosError>();

  // Assessment

  const [assessment, setAssessment] = useState<Assessment>();
  const [isFetchingAssessment, setIsFetchingAssessment] = useState(true);
  const [
    fetchAssessmentError,
    setFetchAssessmentError,
  ] = useState<AxiosError>();

  useEffect(() => {
    if (assessmentId) {
      setIsFetchingAssessment(true);

      getAssessmentById(assessmentId)
        .then(({ data }) => {
          setIsFetchingAssessment(false);
          setAssessment(data);
        })
        .catch((error) => {
          setIsFetchingAssessment(false);
          setFetchAssessmentError(error);
        });
    }
  }, [assessmentId]);

  const sortedCategories = useMemo(() => {
    return (assessment ? assessment.questionnaire.categories : []).sort(
      (a, b) => a.order - b.order
    );
  }, [assessment]);

  //

  const redirectToApplicationList = () => {
    history.push(Paths.applicationInventory_applicationList);
  };

  // Formik

  const initialComments = useMemo(() => {
    let comments: { [key: string]: string } = {};
    if (assessment) {
      assessment.questionnaire.categories.forEach((category) => {
        comments[getCommentFieldName(category)] = category.comment || "";
      });
    }
    return comments;
  }, [assessment]);

  const initialQuestions = useMemo(() => {
    let questions: { [key: string]: number | undefined } = {};
    if (assessment) {
      assessment.questionnaire.categories
        .flatMap((f) => f.questions)
        .forEach((question) => {
          questions[getQuestionFieldName(question)] = question.options.find(
            (f) => f.checked === true
          )?.id;
        });
    }
    return questions;
  }, [assessment]);

  const onSubmit = (
    formValues: IFormValues,
    formikHelpers: FormikHelpers<IFormValues>
  ) => {
    if (!assessment) {
      console.log("An assessment must exist before saving a new one");
      formikHelpers.setSubmitting(false);
      return;
    }

    const saveAction = formValues[SAVE_ACTION_KEY];
    const assessmentStatus: AssessmentStatus =
      saveAction !== SAVE_ACTION_VALUE.SAVE_AS_DRAFT ? "COMPLETE" : "STARTED";

    const payload: Assessment = {
      ...assessment,
      stakeholders: formValues.stakeholders,
      stakeholderGroups: formValues.stakeholderGroups,
      questionnaire: {
        categories: assessment.questionnaire.categories.map((category) => ({
          ...category,
          comment: formValues.comments[getCommentFieldName(category)],
          questions: category.questions.map((question) => ({
            ...question,
            options: question.options.map((option) => ({
              ...option,
              checked:
                formValues.questions[getQuestionFieldName(question)] ===
                option.id,
            })),
          })),
        })),
      },
      status: assessmentStatus,
    };

    patchAssessment(payload)
      .then(() => {
        formikHelpers.setSubmitting(false);
        switch (saveAction) {
          case SAVE_ACTION_VALUE.SAVE:
            redirectToApplicationList();
            break;
        }
      })
      .catch((error) => {
        formikHelpers.setSubmitting(false);
        setSaveError(error);
      });
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      stakeholders: assessment?.stakeholders || [],
      stakeholderGroups: assessment?.stakeholderGroups || [],
      comments: initialComments,
      questions: initialQuestions,
      [SAVE_ACTION_KEY]: SAVE_ACTION_VALUE.SAVE_AS_DRAFT,
    },
    onSubmit: onSubmit,
  });

  const areFieldsValid = (fieldKeys: (keyof IFormValues)[]) => {
    return fieldKeys.every((fieldKey) => !formik.errors[fieldKey]);
  };

  const isQuestionValid = (question: Question): boolean => {
    const questionErrors = formik.errors.questions || {};
    return !questionErrors[getQuestionFieldName(question)];
  };

  const isCommentValid = (category: QuestionnaireCategory): boolean => {
    const commentErrors = formik.errors.comments || {};
    return !commentErrors[getCommentFieldName(category)];
  };

  const questionHasValue = (question: Question): boolean => {
    const questionValues = formik.values.questions || {};
    const value = questionValues[getQuestionFieldName(question)];
    return value !== null && value !== undefined;
  };

  const commentMinLenghtIs1 = (category: QuestionnaireCategory): boolean => {
    const categoryComments = formik.values.comments || {};
    const value = categoryComments[getCommentFieldName(category)];
    return value !== null && value !== undefined && value.length > 0;
  };

  // Wizard

  const shouldNextBtnBeEnabled = (category: QuestionnaireCategory): boolean => {
    return (
      category.questions.every((question) => isQuestionValid(question)) &&
      category.questions.every((question) => questionHasValue(question)) &&
      isCommentValid(category)
    );
  };

  const maxCategoryWithData = [...sortedCategories]
    .reverse()
    .find((category) => {
      return (
        category.questions.some((question) => questionHasValue(question)) ||
        commentMinLenghtIs1(category)
      );
    });
  const canJumpTo = maxCategoryWithData
    ? sortedCategories.findIndex((f) => f.id === maxCategoryWithData.id) + 1
    : 0;

  const disableNavigation = !formik.isValid || formik.isSubmitting;

  const wizardSteps: WizardStep[] = [
    {
      id: 0,
      // t('terms.stakeholders')
      name: t("composed.selectMany", {
        what: t("terms.stakeholders").toLowerCase(),
      }),
      component: <StakeholdersForm />,
      canJumpTo: 0 === currentStep || !disableNavigation,
      enableNext: areFieldsValid(["stakeholders", "stakeholderGroups"]),
    },
    ...sortedCategories.map((category, index) => {
      const stepIndex = index + 1;
      return {
        id: stepIndex,
        name: category.title,
        stepNavItemProps: {
          children: (
            <TextContent>
              <Text component="small">
                {t("composed.Nquestions", { n: category.questions.length })}
              </Text>
            </TextContent>
          ),
        },
        component: <QuestionnaireForm key={category.id} category={category} />,
        canJumpTo:
          stepIndex === currentStep ||
          (stepIndex <= canJumpTo && !disableNavigation),
        enableNext: shouldNextBtnBeEnabled(category),
      } as WizardStep;
    }),
  ];

  const wizardFooter = (
    <CustomWizardFooter
      isFirstStep={currentStep === 0}
      isLastStep={currentStep === sortedCategories.length}
      isDisabled={formik.isSubmitting || formik.isValidating}
      isFormInvalid={!formik.isValid}
      onSave={() => {
        formik.setFieldValue(SAVE_ACTION_KEY, SAVE_ACTION_VALUE.SAVE);
        formik.submitForm();
      }}
      onSaveAsDraft={() => {
        formik.setFieldValue(SAVE_ACTION_KEY, SAVE_ACTION_VALUE.SAVE_AS_DRAFT);
        formik.submitForm();
      }}
    />
  );

  if (fetchAssessmentError) {
    <>
      <PageSection variant="light">
        <ApplicationAssessmentHeader assessment={assessment} />
      </PageSection>
      <PageSection variant="light" type={PageSectionTypes.wizard}>
        <Bullseye>
          <SimpleEmptyState
            icon={BanIcon}
            title={t("message.couldNotFetchTitle")}
            description={t("message.couldNotFetchBody") + "."}
          />
        </Bullseye>
      </PageSection>
    </>;
  }

  return (
    <>
      <PageSection variant="light">
        <ApplicationAssessmentHeader assessment={assessment} />
      </PageSection>
      <PageSection variant="light" type={PageSectionTypes.wizard}>
        {saveError && (
          <Alert
            variant="danger"
            isInline
            title={getAxiosErrorMessage(saveError)}
          />
        )}
        <ConditionalRender
          when={isFetchingAssessment}
          then={<AppPlaceholder />}
        >
          <FormikProvider value={formik}>
            <Wizard
              navAriaLabel="assessment-wizard"
              mainAriaLabel="assesment-wizard"
              steps={wizardSteps}
              footer={wizardFooter}
              onNext={() => {
                setCurrentStep((current) => current + 1);
              }}
              onBack={() => {
                setCurrentStep((current) => current - 1);
              }}
              onClose={redirectToApplicationList}
              onGoToStep={(step) => {
                setCurrentStep(step.id as number);
              }}
            />
          </FormikProvider>
        </ConditionalRender>
      </PageSection>
    </>
  );
};
