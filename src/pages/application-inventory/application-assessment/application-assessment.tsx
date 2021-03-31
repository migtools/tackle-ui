import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormikHelpers, FormikProvider, useFormik } from "formik";

import {
  PageSection,
  PageSectionTypes,
  SelectOptionObject,
  Text,
  Wizard,
  WizardStep,
} from "@patternfly/react-core";

import { PageHeader } from "shared/components";
import { useFetchStakeholderGroups, useFetchStakeholders } from "shared/hooks";

import { AssessmentRoute, Paths } from "Paths";
import {
  Application,
  Assessment,
  Stakeholder,
  StakeholderGroup,
} from "api/models";
import { getApplicationById, getAssessmentById } from "api/rest";

import { WizardFooter } from "./components/wizard-footer";
import { StakeholdersForm } from "./components/stakeholders-form";
import { WizardQuestionnaireStep } from "./components/wizard-questionnaire-step";

const FAKE_ASSESSMENT: Assessment = {
  id: 1,
  applicationId: 2,
  status: "STARTED",
  stakeholders: [],
  stakeholderGroups: [],
  questionnaire: {
    categories: [
      {
        id: 1,
        order: 0,
        title: "General questions",
        comments: "It was hard to answer these questions, I hope I did it well",
        questions: [
          {
            id: 1,
            order: 0,
            question: "What's you favorite movie?",
            description: "This represents a multiple option choice",
            options: [
              {
                id: 1,
                order: 0,
                option: "Titanic",
                checked: true,
              },
              {
                id: 2,
                order: 1,
                option: "Start war",
                checked: false,
              },
              {
                id: 3,
                order: 2,
                option: "Dr. Strange",
                checked: true,
              },
            ],
          },
          {
            id: 2,
            order: 1,
            question: "How old are you?",
            description: "This represents a single option choice",
            options: [
              {
                id: 4,
                order: 0,
                option: "I'm younger than 30",
                checked: true,
              },
              {
                id: 5,
                order: 1,
                option: "I'm older than 30",
                checked: false,
              },
              {
                id: 6,
                order: 2,
                option: "I'm too old to tell you",
                checked: false,
              },
            ],
          },
        ],
      },
    ],
  },
};

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
  const { assessmentId } = useParams<AssessmentRoute>();

  // Fetch assessment and application

  const [assessment, setAssessment] = useState<Assessment>();
  const [application, setApplication] = useState<Application>();

  useEffect(() => {
    if (assessmentId) {
      getAssessmentById(assessmentId)
        .then(({ data }) => {
          setAssessment(data);
          return getApplicationById(data.applicationId);
        })
        .then(({ data }) => {
          setApplication(data);
        })
        .catch((error) => {
          // TODO replace the code above
          setAssessment(FAKE_ASSESSMENT);
        });
    }
  }, [assessmentId]);

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

  //

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

  const groupsInitialValue = useMemo(() => {
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

  // Formik

  const initialValues: IFormValues = {
    stakeholders: stakeholdersInitialValue,
    stakeholderGroups: groupsInitialValue,
  };

  const onSubmit = (
    formValues: IFormValues,
    formikHelpers: FormikHelpers<IFormValues>
  ) => {
    console.log(formValues);
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

  // Wizard step1

  const wizardSteps: WizardStep[] = [
    {
      id: StepId.Stakeholders,
      name: t("composed.selectMany", { what: t("terms.stakeholders") }),
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
    assessment.questionnaire.categories.forEach((section) => {
      wizardSteps.push({
        id: section.id,
        name: section.title,
        component: <WizardQuestionnaireStep section={section} />,
        enableNext: true,
      });
    });
  }

  //

  const wizardFooter = (
    <WizardFooter
      isFirstStep={false}
      isDisabled={false}
      isNextDisabled={true}
      onBack={() => {}}
      onNext={() => {}}
      onCancel={() => {}}
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
      </PageSection>
      <PageSection variant="light" type={PageSectionTypes.wizard}>
        <FormikProvider value={formik}>
          <Wizard
            navAriaLabel="assessment-wizard"
            mainAriaLabel="assesment-wizard"
            steps={wizardSteps}
            footer={wizardFooter}
          />
        </FormikProvider>
      </PageSection>
    </>
  );
};
