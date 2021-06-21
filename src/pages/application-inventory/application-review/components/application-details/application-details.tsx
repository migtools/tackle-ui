import React from "react";

import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  List,
  ListItem,
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
          <List>
            {assessment?.questionnaire.categories
              .filter((f) => f.comment && f.comment.trim().length > 0)
              .map((category, i) => (
                <ListItem key={i}>
                  {category.title}: {category.comment}
                </ListItem>
              ))}
          </List>
        </DescriptionListDescription>
      </DescriptionListGroup>
    </DescriptionList>
  );
};
