import React from "react";
import { PageSection, PageSectionVariants } from "@patternfly/react-core";

import styles from "./app-page-section.module.css";

export const AppPageSection: React.FC = ({ children }) => {
  return (
    <PageSection
      variant={PageSectionVariants.light}
      className={styles.pageSection}
    >
      {children}
    </PageSection>
  );
};
