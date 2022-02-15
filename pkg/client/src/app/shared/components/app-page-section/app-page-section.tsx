import React from "react";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";

import "./app-page-section.css";

export const AppPageSection: React.FC = ({ children }) => {
  return (
    <PageSection variant={PageSectionVariants.light} className="pageSection">
      {children}
    </PageSection>
  );
};
