import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";

import { BusinessService } from "api/models";
import { getBusinessServiceById } from "api/rest";

export interface ChildrenProps {
  businessService?: BusinessService;
  isFetching: boolean;
  fetchError?: AxiosError;
}

export interface RemoteBusinessServiceProps {
  businessServiceId: number | string;
  children: (args: ChildrenProps) => any;
}

export const RemoteBusinessService: React.FC<RemoteBusinessServiceProps> = ({
  businessServiceId,
  children,
}) => {
  const [entity, setEntity] = useState<BusinessService>();
  const [fetchError, setFetchError] = useState<AxiosError>();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);
    getBusinessServiceById(businessServiceId)
      .then(({ data }) => {
        setEntity(data);
        setIsFetching(false);
      })
      .catch((error: AxiosError) => {
        setFetchError(error);
        setIsFetching(false);
      });
  }, [businessServiceId]);

  return children({
    businessService: entity,
    fetchError,
    isFetching,
  });
};
