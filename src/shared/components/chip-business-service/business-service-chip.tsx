import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useFetch } from "shared/hooks";

import { BusinessService } from "api/models";
import { getBusinessServiceById } from "api/rest";
import { Spinner } from "@patternfly/react-core";

export interface IChipBusinessServiceProps {
  id: number | string;
}

export const ChipBusinessService: React.FC<IChipBusinessServiceProps> = ({
  id,
}) => {
  const { t } = useTranslation();

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

  if (fetchError) {
    return <span>id: {id}</span>;
  }

  if (isFetching) {
    return (
      <>
        <Spinner size="sm" /> {t("terms.loading")}...
      </>
    );
  }

  return <>{businessService?.name}</>;
};
