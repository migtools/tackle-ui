import React, { useCallback, useEffect } from "react";

import { useFetch } from "shared/hooks";
import { NodeFetch } from "shared/components";

import { BusinessService } from "api/models";
import { getBusinessServiceById } from "api/rest";

export interface IChipBusinessServiceProps {
  id: number | string;
}

export const ChipBusinessService: React.FC<IChipBusinessServiceProps> = ({
  id,
}) => {
  const onFetchBusinessService = useCallback(() => {
    return getBusinessServiceById(id);
  }, [id]);

  const {
    data: businessService,
    isFetching,
    fetchError,
    requestFetch: refreshBusinessService,
  } = useFetch<BusinessService>({
    defaultIsFetching: true,
    onFetch: onFetchBusinessService,
  });

  useEffect(() => {
    refreshBusinessService();
  }, [refreshBusinessService]);

  return (
    <NodeFetch
      isFetching={isFetching}
      fetchError={fetchError}
      node={businessService?.name}
    />
  );
};
