import React, { useCallback, useEffect } from "react";

import { RiskLabel } from "shared/components";
import { useFetch } from "shared/hooks";

import { Application, AssessmentRisk } from "api/models";
import { getAssessmentLandscape } from "api/rest";

export interface IApplicationRiskProps {
  application: Application;
}

export const ApplicationRisk: React.FC<IApplicationRiskProps> = ({
  application,
}) => {
  // Risk
  const fetchRiskData = useCallback(() => {
    return getAssessmentLandscape([application.id!]).then(
      ({ data }) => data[0]
    );
  }, [application]);

  const {
    data: applicationRisk,
    requestFetch: fetchRisk,
  } = useFetch<AssessmentRisk>({
    defaultIsFetching: true,
    onFetchPromise: fetchRiskData,
  });

  useEffect(() => {
    fetchRisk();
  }, [application]);

  return (
    <RiskLabel risk={applicationRisk ? applicationRisk.risk : "UNKNOWN"} />
  );
};
