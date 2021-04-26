import React, { useEffect, useMemo, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormikHelpers, FormikProvider, useFormik } from "formik";
import { AxiosError } from "axios";

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
import { useFetch } from "shared/hooks";

import { AssessmentRoute, Paths } from "Paths";
import {
  Application,
  Assessment,
  PageRepresentation,
  Stakeholder,
  StakeholderGroup,
  StakeholderGroupPage,
  StakeholderPage,
} from "api/models";
import { getApplicationById, getAssessmentById } from "api/rest";

import { CustomWizardFooter } from "./components/custom-wizard-footer";
import { StakeholdersForm } from "./components/stakeholders-form";

import {
  getAllStakeholderGroups,
  getAllStakeholders,
  stakeholderGroupPageMapper,
  stakeholderPageMapper,
} from "api/apiUtils";

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
  const history = useHistory();

  // Assessment
  const [assessment, setAssessment] = useState<Assessment>();
  const [
    fetchAssessmentError,
    setFetchAssessmentError,
  ] = useState<AxiosError>();
  const [isFetchingAssessment, setIsFetchingAssessment] = useState(true);

  useEffect(() => {
    if (assessmentId) {
      setIsFetchingAssessment(true);

      getAssessmentById(assessmentId)
        .then(({ data }) => {
          setAssessment(data);
          setIsFetchingAssessment(false);
        })
        .catch((error) => {
          setFetchAssessmentError(error);
          setIsFetchingAssessment(false);
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
    data: stakeholders,
    isFetching: isFetchingStakeholders,
    fetchError: fetchErrorStakeholders,
    requestFetch: fetchAllStakeholders,
  } = useFetch<StakeholderPage, PageRepresentation<Stakeholder>>({
    defaultIsFetching: true,
    onFetch: getAllStakeholders,
    mapper: stakeholderPageMapper,
  });

  useEffect(() => {
    fetchAllStakeholders();
  }, [fetchAllStakeholders]);

  // Fetch stakeholder groups

  const {
    data: stakeholderGroups,
    isFetching: isFetchingStakeholderGroups,
    fetchError: fetchErrorStakeholderGroups,
    requestFetch: fetchAllStakeholderGroups,
  } = useFetch<StakeholderGroupPage, PageRepresentation<StakeholderGroup>>({
    defaultIsFetching: true,
    onFetch: getAllStakeholderGroups,
    mapper: stakeholderGroupPageMapper,
  });

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

  // Wizard

  const wizardSteps: WizardStep[] = [
    {
      id: StepId.Stakeholders,
      name: t("composed.selectMany", {
        // t('terms.stakeholders')
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
