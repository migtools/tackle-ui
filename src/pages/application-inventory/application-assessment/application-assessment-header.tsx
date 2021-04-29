import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Text } from "@patternfly/react-core";

import { PageHeader } from "shared/components";

import { Paths } from "Paths";
import { Application, Assessment } from "api/models";
import { getApplicationById } from "api/rest";

export interface ApplicationAssessmentHeaderProps {
  assessment?: Assessment;
}

export const ApplicationAssessmentHeader: React.FC<ApplicationAssessmentHeaderProps> = ({
  assessment,
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

  return (
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
  );
};
