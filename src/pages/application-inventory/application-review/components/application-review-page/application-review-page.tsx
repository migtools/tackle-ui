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

import { PageSection, Text } from "@patternfly/react-core";

import { PageHeader } from "shared/components";

import { Paths } from "Paths";

export const ApplicationReviewPage: React.FC = ({ children }) => {
  const { t } = useTranslation();

  return (
    <>
      <PageSection variant="light">
        <PageHeader
          title={t("terms.review")}
          description={
            <Text component="p">{t("message.reviewInstructions")}</Text>
          }
          breadcrumbs={[
            {
              title: t("terms.applications"),
              path: Paths.applicationInventory_applicationList,
            },
            {
              title: t("terms.review"),
              path: Paths.applicationInventory_review,
            },
          ]}
          menuActions={[]}
        />
      </PageSection>
      <PageSection variant="light">{children}</PageSection>
    </>
  );
};
