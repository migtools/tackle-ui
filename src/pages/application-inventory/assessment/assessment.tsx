import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Divider, PageSection, Wizard } from "@patternfly/react-core";

import { PageHeader } from "shared/components";

import { AssessmentRoute, Paths } from "Paths";
import { Application } from "api/models";

import { getApplicationById } from "api/rest";

import { WizardFooter } from "./components/wizard-footer";

export const Assessment: React.FC = () => {
  const { t } = useTranslation();

  const { assessmentId } = useParams<AssessmentRoute>();

  const [application, setApplication] = useState<Application>();

  useEffect(() => {
    if (assessmentId) {
      getApplicationById(assessmentId).then(({ data }) => {
        setApplication(data);
      });
    }
  }, [assessmentId]);

  return (
    <>
      <PageSection variant="light">
        <PageHeader
          title={t("composed.applicationAssessment")}
          description={application?.name}
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
      <Divider />
      <Wizard
        navAriaLabel={"title"}
        mainAriaLabel={` content`}
        steps={[{ name: "First step", component: <p>Step 1 content</p> }]}
        footer={
          <WizardFooter
            isFirstStep={false}
            isDisabled={false}
            isNextDisabled={true}
            onBack={() => {}}
            onNext={() => {}}
            onCancel={() => {}}
          />
        }
      />
    </>
  );
};
