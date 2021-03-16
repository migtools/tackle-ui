import React from "react";
import { useTranslation } from "react-i18next";

import { Divider, PageSection, Wizard } from "@patternfly/react-core";

import { PageHeader } from "shared/components";
import { Paths } from "Paths";

export const Assessment: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageSection variant="light">
        <PageHeader
          title={t("composed.applicationAssessment")}
          description={"application-1"}
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
        steps={[
          { name: "First step", component: <p>Step 1 content</p> },
          { name: "Second step", component: <p>Step 2 content</p> },
          { name: "Third step", component: <p>Step 3 content</p> },
          { name: "Fourth step", component: <p>Step 4 content</p> },
          {
            name: "Review",
            component: <p>Review step content</p>,
            nextButtonText: "Finish",
          },
        ]}
      />
    </>
  );
};
