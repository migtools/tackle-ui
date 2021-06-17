import React from "react";

import { PageSection, Text } from "@patternfly/react-core";

import { PageHeader } from "shared/components";

import { Paths } from "Paths";

export const ApplicationReview: React.FC = () => {
  return (
    <>
      <PageSection variant="light">
        <PageHeader
          title="Application imports"
          breadcrumbs={[
            {
              title: "Applications",
              path: Paths.applicationInventory_applicationList,
            },
            {
              title: "Application imports",
              path: "",
            },
          ]}
          menuActions={[]}
        />
      </PageSection>
      <PageSection>hola</PageSection>
    </>
  );
};
