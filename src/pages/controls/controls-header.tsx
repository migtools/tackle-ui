import React from "react";
import { useTranslation } from "react-i18next";

import { AppPageSection, PageHeader } from "shared/components";
import { Paths } from "Paths";

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
