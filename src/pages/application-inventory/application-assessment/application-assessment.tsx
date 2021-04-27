import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormikHelpers, FormikProvider, useFormik } from "formik";

import {
  Bullseye,
  PageSection,
  PageSectionTypes,
  SelectOptionObject,
  Text,
  Wizard,
  WizardStep,
} from "@patternfly/react-core";
import { BanIcon } from "@patternfly/react-icons";

import {
  ConditionalRender,
  SimpleEmptyState,
  PageHeader,
  AppPlaceholder,
} from "shared/components";
import { useFetchStakeholderGroups, useFetchStakeholders } from "shared/hooks";

import { AssessmentRoute, Paths } from "Paths";
import {
  Application,
  Assessment,
  Stakeholder,
  StakeholderGroup,
} from "api/models";
import { getApplicationById, getAssessmentById } from "api/rest";

import { CustomWizardFooter } from "./components/custom-wizard-footer";
import { StakeholdersForm } from "./components/stakeholders-form";
import { AxiosError } from "axios";
import { WizardQuestionnaireStep } from "./components/wizard-questionnaire-step";

enum StepId {
  Stakeholders = 1,
}

export interface IFormValues {
  stakeholders: number[];
  stakeholderGroups: number[];
}

export const ApplicationAssessment: React.FC = () => {
  const { t } = useTranslation();

  const history = useHistory();
  const { assessmentId } = useParams<AssessmentRoute>();

  const [currentStep, setCurrentStep] = useState(0);

  // Assessment

  const [assessment, setAssessment] = useState<Assessment>();
  const [isFetchingAssessment, setIsFetchingAssessment] = useState(false);
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

  // Application

  const [application, setApplication] = useState<Application>();

  useEffect(() => {
    if (assessment) {
      getApplicationById(assessment.applicationId).then(({ data }) => {
        setApplication(data);
      });
    }
  }, [assessment]);

  // Formik

  const initialValues: IFormValues = {
    stakeholders: assessment?.stakeholders || [],
    stakeholderGroups: assessment?.stakeholderGroups || [],
  };

  const onSubmit = (
    formValues: IFormValues,
    formikHelpers: FormikHelpers<IFormValues>
  ) => {
    if (!assessment) {
      console.log("An assessment must exist before saving a new one");
      formikHelpers.setSubmitting(false);
      return;
    }

    const {
      stakeholders: formStakeholders,
      stakeholderGroups: formStakeholderGroups,
      ...restFormValues
    } = formValues;

    console.log(restFormValues);

    //

    // const newStakeholders = formStakeholders.map((f) => f.entity.id!);
    // const newStakeholderGroups = formStakeholderGroups.map((f) => f.entity.id!);

    // //

    // const newCategories = assessment.questionnaire.categories.map(
    //   (category) => {
    //     return {
    //       ...category,
    //     };
    //   }
    // );

    //

    // const payload: Assessment = {
    //   ...assessment,
    //   stakeholders: newStakeholders,
    //   stakeholderGroups: newStakeholderGroups,
    //   questionnaire: {
    //     categories: newCategories,
    //   },
    // };

    // console.log(payload);

    // patchAssessment();
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validate: () => {},
    onSubmit: onSubmit,
  });

  const areFieldsValid = (fieldKeys: (keyof IFormValues)[]) => {
    return fieldKeys.every((fieldKey) => !formik.errors[fieldKey]);
  };

  // Wizard

  const wizardSteps: WizardStep[] = [
    {
      id: 0,
      // t('terms.stakeholders')
      name: t("composed.selectMany", {
        what: t("terms.stakeholders").toLowerCase(),
      }),
      component: <StakeholdersForm />,
      // enableNext: areFieldsValid(["stakeholders", "stakeholderGroups"]),
      canJumpTo: currentStep >= 0,
    },
    ...(assessment ? assessment.questionnaire.categories : [])
      .sort((a, b) => a.order - b.order)
      .map((section, index) => ({
        id: index,
        name: section.title,
        component: (
          <WizardQuestionnaireStep key={section.id} category={section} />
        ),
        // enableNext: true,
        canJumpTo: currentStep >= index + 1,
      })),
  ];

  const wizardFooter = (
    <CustomWizardFooter
      isFirstStep={currentStep === 0}
      isDisabled={false}
      isNextDisabled={false}
      // onBack={() => {
      //   console.log("back");
      // }}
      // onNext={() => {
      //   console.log("next");
      // }}
      // onCancel={() => {
      //   history.push(Paths.applicationInventory_applicationList);
      // }}
    />
  );

  return (
    <>
      <PageSection variant="light">
        <PageHeader
          title={t("composed.applicationAssessment")}
          description={<Text component="p">{application?.name}</Text>}
          breadcrumbs={[
            {
              title: t("terms.applications"),
              path: Paths.applicationInventory_applicationList,
            },
            {
              title: t("terms.assessment"),
              path: Paths.applicationInventory_assessment,
            },
          ]}
          menuActions={[]}
        />
        <button type="button" onClick={() => formik.submitForm()}>
          Submit
        </button>
      </PageSection>
      <PageSection variant="light" type={PageSectionTypes.wizard}>
        <ConditionalRender
          when={isFetchingAssessment}
          then={<AppPlaceholder />}
        >
          {fetchAssessmentError ? (
            <Bullseye>
              <SimpleEmptyState
                icon={BanIcon}
                title={t("message.couldNotFetchTitle")}
                description={t("message.couldNotFetchBody") + "."}
              />
            </Bullseye>
          ) : (
            <FormikProvider value={formik}>
              <Wizard
                navAriaLabel="assessment-wizard"
                mainAriaLabel="assesment-wizard"
                steps={wizardSteps}
                footer={wizardFooter}
                onNext={() => {
                  console.log("carlos");
                }}
                onClose={() => {
                  console.log("closee");
                }}
              />
            </FormikProvider>
          )}
        </ConditionalRender>
      </PageSection>
    </>
  );
};
