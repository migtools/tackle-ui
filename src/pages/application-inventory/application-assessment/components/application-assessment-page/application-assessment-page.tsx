/*
Copyright © 2021 the Konveyor Contributors (https://konveyor.io/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import React from "react";
import { PageSection, PageSectionTypes } from "@patternfly/react-core";
import { Assessment } from "api/models";

import { ApplicationAssessmentPageHeader } from "./application-assessment-page-header";

export interface IApplicationAssessmentPageProps {
  assessment?: Assessment;
  children: any;
}

export const ApplicationAssessmentPage: React.FC<IApplicationAssessmentPageProps> = ({
  assessment,
  children,
}) => {
  return (
    <>
      <PageSection variant="light">
        <ApplicationAssessmentPageHeader assessment={assessment} />
      </PageSection>
      <PageSection variant="light" type={PageSectionTypes.wizard}>
        {children}
      </PageSection>
    </>
  );
};
