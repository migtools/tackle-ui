import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useFetch } from "shared/hooks";

import { BusinessService } from "api/models";
import { getTagById } from "api/rest";
import { Spinner } from "@patternfly/react-core";

export interface IChipTagProps {
  id: number | string;
}

export const ChipTag: React.FC<IChipTagProps> = ({ id }) => {
  const { t } = useTranslation();

  const onFetchTag = useCallback(() => {
    return getTagById(id);
  }, [id]);

  const {
    data: tag,
    isFetching,
    fetchError,
    requestFetch: refreshTag,
  } = useFetch<BusinessService>({
    defaultIsFetching: true,
    onFetch: onFetchTag,
  });

  useEffect(() => {
    refreshTag();
  }, [refreshTag]);

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

  return <>{tag?.name}</>;
};
