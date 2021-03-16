import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { useTranslation } from "react-i18next";

import { Wizard, WizardStep } from "@patternfly/react-core";

import { Application, Assessment } from "api/models";
import { getApplicationById } from "api/rest";

import { WizardFooter } from "./wizard-footer";

export interface AssessmentModalProps {
  assessment?: Assessment;
  onSaved: (response: AxiosResponse<Assessment>) => void;
  onCancel: () => void;
}

export const AssessmentModal: React.FC<AssessmentModalProps> = ({
  assessment,
  onCancel,
}) => {
  const { t } = useTranslation();

  const [application, setApplication] = useState<Application>();

  useEffect(() => {
    if (assessment) {
      getApplicationById(assessment.applicationId).then(({ data }) => {
        setApplication(data);
      });
    }
  }, [assessment]);

  const steps: WizardStep[] = [
    {
      id: "",
      name: t("composed.selectStakeholders"),
      canJumpTo: false,
      component: <p>Step 1 content</p>,
    },
  ];

  return (
    <Wizard
      isOpen={!!assessment}
      title={t("composed.applicationAssessment")}
      description={application?.name}
      steps={steps}
      onClose={onCancel}
      footer={
        <WizardFooter
          isFirstStep={true}
          isNextDisabled={true}
          onBack={() => {}}
          onNext={() => {}}
          onCancel={() => {}}
        />
      }
    />
  );
};
