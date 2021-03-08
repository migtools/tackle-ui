import React from "react";
import {
  PageSection,
  PageSectionVariants,
  Text,
  TextContent,
} from "@patternfly/react-core";

export const ApplicationInventory: React.FC = () => {
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Application inventory</Text>
        </TextContent>
        <PageSection>hola</PageSection>
      </PageSection>
    </>
  );
};
