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
            <Text component="p">
              Use this section to provide your assessment of the possible
              migration/modernization plan and effort estimation.
            </Text>
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
