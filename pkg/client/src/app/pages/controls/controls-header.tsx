import React from "react";
import { useTranslation } from "react-i18next";

import { AppPageSection, PageHeader } from "app/shared/components";
import { Paths } from "app/Paths";

export const EditCompanyHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <AppPageSection>
      <PageHeader
        title={t("terms.controls")}
        breadcrumbs={[]}
        menuActions={[]}
        navItems={[
          {
            title: t("terms.stakeholders"),
            path: Paths.controls_stakeholders,
          },
          {
            title: t("terms.stakeholderGroups"),
            path: Paths.controls_stakeholderGroups,
          },
          {
            title: t("terms.jobFunctions"),
            path: Paths.controls_jobFunctions,
          },
          {
            title: t("terms.businessServices"),
            path: Paths.controls_businessServices,
          },
          {
            title: t("terms.tags"),
            path: Paths.controls_tags,
          },
        ]}
      />
    </AppPageSection>
  );
};
