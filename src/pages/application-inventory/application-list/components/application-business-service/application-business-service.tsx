import React, { useCallback, useEffect } from "react";

import { useFetch } from "shared/hooks";

import { BusinessService } from "api/models";
import { getBusinessServiceById } from "api/rest";

export interface ApplicationBusinessServiceProps {
  id: number | string;
}

export const ApplicationBusinessService: React.FC<ApplicationBusinessServiceProps> = ({
  id,
}) => {
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
    return <></>;
  }

  return <>{businessService?.name}</>;
};
