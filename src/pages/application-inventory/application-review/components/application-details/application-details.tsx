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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  return (
    <DescriptionList>
      <DescriptionListGroup>
        <DescriptionListTerm>{t("terms.applicationName")}</DescriptionListTerm>
        <DescriptionListDescription>
          {application.name}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{t("terms.description")}</DescriptionListTerm>
        <DescriptionListDescription>
          {application.description}
        </DescriptionListDescription>
      </DescriptionListGroup>
      <DescriptionListGroup>
        <DescriptionListTerm>{t("terms.assessmentNotes")}</DescriptionListTerm>
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
