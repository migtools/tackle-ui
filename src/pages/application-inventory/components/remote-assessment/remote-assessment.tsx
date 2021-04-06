import React, { useEffect, useState } from "react";
import { AxiosError } from "axios";

import { Assessment } from "api/models";
import { getAssessments } from "api/rest";

export interface ChildrenProps {
  assessment?: Assessment;
  isFetching: boolean;
  fetchError?: AxiosError;
}

export interface RemoteAssessmentProps {
  applicationId: number;
  children: (args: ChildrenProps) => any;
}

export const RemoteAssessment: React.FC<RemoteAssessmentProps> = ({
  applicationId,
  children,
}) => {
  const [entity, setEntity] = useState<Assessment>();
  const [fetchError, setFetchError] = useState<AxiosError>();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    setIsFetching(true);

    getAssessments({ applicationId })
      .then(({ data }) => {
        setIsFetching(false);
        setFetchError(undefined);
        setEntity(data[0]);
      })
      .catch((error) => {
        setIsFetching(false);
        setFetchError(error);
      });
  }, [applicationId]);

  return children({
    assessment: entity,
    fetchError,
    isFetching,
  });
};
