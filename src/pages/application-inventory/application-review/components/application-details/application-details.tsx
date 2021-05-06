import React from "react";

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from "@patternfly/react-core";

import { Application, Assessment } from "api/models";

export interface IApplicationDetailsProps {
  application: Application;
  assessment?: Assessment;
}

export const ApplicationDetails: React.FC<IApplicationDetailsProps> = ({
  application,
  assessment,
}) => {
  return (
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>Application name</DescriptionListTerm>
        <DescriptionListDescription>
          {application.name}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Description</DescriptionListTerm>
        <DescriptionListDescription>
          {application.description}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>Assessment notes</DescriptionListTerm>
        <DescriptionListDescription>
          {assessment?.questionnaire.categories
            .map((f) => f.comment)
            .filter((f) => f !== undefined && f.length > 0)
            .join(". ")}
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
