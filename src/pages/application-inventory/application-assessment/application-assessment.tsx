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
import {
  getCategoryCommentField,
  getCategoryQuestionField,
} from "./assessment-utils";

enum StepId {
  Stakeholders = 1,
}

export interface IFormValues {
  stakeholders: SelectOptionEntity[];
  stakeholderGroups: SelectOptionEntity[];
}

interface SelectOptionEntity extends SelectOptionObject {
  entity: Stakeholder | StakeholderGroup;
}

const toSelectOptionStakeholder = (
  entity: Stakeholder
): SelectOptionEntity => ({
  entity: { ...entity },
  toString: () => {
    return entity.displayName;
  },
});

const toSelectOptionStakeholderGroup = (
  entity: StakeholderGroup
): SelectOptionEntity => ({
  entity: { ...entity },
  toString: () => {
    return entity.name;
  },
});

export const ApplicationAssessment: React.FC = () => {
  const { t } = useTranslation();

  const history = useHistory();
  const { assessmentId } = useParams<AssessmentRoute>();

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

  // Fetch stakeholders

  const {
    stakeholders,
    isFetching: isFetchingStakeholders,
    fetchError: fetchErrorStakeholders,
    fetchAllStakeholders,
  } = useFetchStakeholders();

  useEffect(() => {
    fetchAllStakeholders();
  }, [fetchAllStakeholders]);

  // Fetch stakeholder groups

  const {
    stakeholderGroups,
    isFetching: isFetchingStakeholderGroups,
    fetchError: fetchErrorStakeholderGroups,
    fetchAllStakeholderGroups,
  } = useFetchStakeholderGroups();

  useEffect(() => {
    fetchAllStakeholderGroups();
  }, [fetchAllStakeholderGroups]);

  // Formik initial values

  const stakeholdersInitialValue = useMemo(() => {
    if (
      assessment &&
      assessment.stakeholders &&
      stakeholders &&
      stakeholders.data
    ) {
      return assessment.stakeholders.map((stakeholderId) => {
        const searched = stakeholders.data.find(
          (stakeholder) => stakeholder.id === stakeholderId
        );

        return searched
          ? toSelectOptionStakeholder(searched)
          : toSelectOptionStakeholder({
              id: stakeholderId,
              displayName: t("terms.unknown"),
              email: t("terms.unknown"),
            });
      });
    }

    return [];
  }, [assessment, stakeholders, t]);

  const stakeholderGroupsInitialValue = useMemo(() => {
    if (
      assessment &&
      assessment.stakeholderGroups &&
      stakeholderGroups &&
      stakeholderGroups.data
    ) {
      return assessment.stakeholderGroups.map((groupId) => {
        const searched = stakeholderGroups.data.find(
          (group) => group.id === groupId
        );

        return searched
          ? toSelectOptionStakeholderGroup(searched)
          : toSelectOptionStakeholderGroup({
              id: groupId,
              name: t("terms.unknown"),
              description: t("terms.unknown"),
            });
      });
    }

    return [];
  }, [assessment, stakeholderGroups, t]);

  // Questionnaire initial values

  const questionnaireFields = useMemo(() => {
    const result: any = {};

    if (assessment) {
      assessment.questionnaire.categories.forEach((category) => {
        const categoryFieldName = getCategoryCommentField(category);
        result[categoryFieldName] = category.comment;

        category.questions.forEach((question) => {
          const questionFieldName = getCategoryQuestionField(
            category,
            question
          );
          result[questionFieldName] = (question.options || []).find(
            (f) => f.checked === true
          );
        });
      });
    }

    return result;
  }, [assessment]);

  // Formik

  const initialValues: IFormValues = {
    stakeholders: stakeholdersInitialValue,
    stakeholderGroups: stakeholderGroupsInitialValue,
    ...questionnaireFields,
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

    //

    const newStakeholders = formStakeholders.map((f) => f.entity.id!);
    const newStakeholderGroups = formStakeholderGroups.map((f) => f.entity.id!);

    //

    const newCategories = assessment.questionnaire.categories.map(
      (category) => {
        return {
          ...category,
        };
      }
    );

    //

    const payload: Assessment = {
      ...assessment,
      stakeholders: newStakeholders,
      stakeholderGroups: newStakeholderGroups,
      questionnaire: {
        categories: newCategories,
      },
    };

    console.log(payload);

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
      id: StepId.Stakeholders,
      // t('terms.stakeholders')
      name: t("composed.selectMany", {
        what: t("terms.stakeholders").toLowerCase(),
      }),
      component: (
        <StakeholdersForm
          stakeholders={stakeholders?.data}
          isFetchingStakeholders={isFetchingStakeholders}
          fetchErrorStakeholders={fetchErrorStakeholders}
          stakeholderGroups={stakeholderGroups?.data}
          isFetchingStakeholderGroups={isFetchingStakeholderGroups}
          fetchErrorStakeholderGroups={fetchErrorStakeholderGroups}
        />
      ),
      enableNext: areFieldsValid(["stakeholders", "stakeholderGroups"]),
    },
  ];

  if (assessment) {
    assessment.questionnaire.categories
      .sort((a, b) => a.order - b.order)
      .forEach((section) => {
        wizardSteps.push({
          id: section.id,
          name: section.title,
          component: (
            <WizardQuestionnaireStep key={section.id} category={section} />
          ),
          enableNext: true,
        });
      });
  }

  const wizardFooter = (
    <CustomWizardFooter
      isFirstStep={true}
      isDisabled={false}
      isNextDisabled={true}
      onBack={() => {}}
      onNext={() => {}}
      onCancel={() => {
        history.push(Paths.applicationInventory_applicationList);
      }}
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
              />
            </FormikProvider>
          )}
        </ConditionalRender>
      </PageSection>
    </>
  );
};
