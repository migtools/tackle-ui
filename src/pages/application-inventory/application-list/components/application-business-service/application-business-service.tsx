import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { EmptyTextMessage } from "shared/components";
import { useFetch } from "shared/hooks";

import { BusinessService } from "api/models";
import { getBusinessServiceById } from "api/rest";

export interface ApplicationBusinessServiceProps {
  id: number | string;
}

export const ApplicationBusinessService: React.FC<ApplicationBusinessServiceProps> = ({
  id,
}) => {
  const { t } = useTranslation();

  const onFetchBusinessService = useCallback(() => {
    return getBusinessServiceById(id);
  }, [id]);

  const {
    data: businessService,
    fetchError,
    requestFetch: refreshBusinessService,
  } = useFetch<BusinessService>({
    defaultIsFetching: true,
    onFetch: onFetchBusinessService,
  });

  useEffect(() => {
    refreshBusinessService();
  }, [refreshBusinessService]);

  if (fetchError) {
    return <EmptyTextMessage message={t("terms.notAvailable")} />;
  }

  return <>{businessService?.name}</>;
};
