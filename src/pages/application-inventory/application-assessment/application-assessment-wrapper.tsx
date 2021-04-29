import React from "react";
import { PageSection, PageSectionTypes } from "@patternfly/react-core";
import { Assessment } from "api/models";

import { ApplicationAssessmentHeader } from "./application-assessment-header";

export interface IApplicationAssessmentWrapperProps {
  assessment?: Assessment;
  children: any;
}

export const ApplicationAssessmentWrapper: React.FC<IApplicationAssessmentWrapperProps> = ({
  assessment,
  children,
}) => {
  return (
    <>
      <PageSection variant="light">
        <ApplicationAssessmentHeader assessment={assessment} />
      </PageSection>
      <PageSection variant="light" type={PageSectionTypes.wizard}>
        {children}
      </PageSection>
    </>
  );
};
