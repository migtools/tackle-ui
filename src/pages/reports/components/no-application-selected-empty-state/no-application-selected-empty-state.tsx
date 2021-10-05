import React from "react";
import { useTranslation } from "react-i18next";

import { NoDataEmptyState } from "shared/components";

export const NoApplicationSelectedEmptyState: React.FC = () => {
  const { t } = useTranslation();

  return <NoDataEmptyState title={t("message.noDataAvailableTitle")} />;
};
