import React from "react";
import { useTranslation } from "react-i18next";

import { EmptyTextMessage } from "shared/components";
import { Application } from "api/models";

import { RemoteBusinessService } from "../remote-business-service";

export interface ApplicationBusinessServiceProps {
  application: Application;
}

export const ApplicationBusinessService: React.FC<ApplicationBusinessServiceProps> = ({
  application,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {application.businessService && (
        <RemoteBusinessService businessServiceId={application.businessService}>
          {({ businessService, fetchError }) =>
            fetchError ? (
              <EmptyTextMessage message={t("terms.notAvailable")} />
            ) : (
              businessService?.name || ""
            )
          }
        </RemoteBusinessService>
      )}
    </>
  );
};
